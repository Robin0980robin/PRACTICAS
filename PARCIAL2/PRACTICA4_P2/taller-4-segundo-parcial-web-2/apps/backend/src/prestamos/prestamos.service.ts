import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { WebhookEmitterService } from '../common/webhook-emitter.service';
import * as fs from 'fs';
import * as path from 'path';

export interface Medicamento {
  id: number;
  nombre: string;
  cantidad: number;
  dosis: string;
  frecuencia: string;
  duracionDias: number;
}

export interface Prescripcion {
  id: number;
  pacienteId: string;
  pacienteNombre: string;
  medicoId: string;
  medicoNombre: string;
  fechaPrescripcion: string;
  fechaVencimiento: string;
  medicamentos: Medicamento[];
  estado: 'pendiente' | 'surtida' | 'vencida';
  farmaciaRecomendada?: string;
  precioTotal?: number;
  ahorro?: number;
  diasRestantes?: number;
}

@Injectable()
export class PrescripcionesService {
  private readonly logger = new Logger(PrescripcionesService.name);
  private readonly dbPath = path.join(process.cwd(), 'data', 'prescripciones.json');
  private prescripciones: Prescripcion[] = [];
  private nextId = 1;

  constructor(private readonly webhookEmitter: WebhookEmitterService) {
    this.loadData();
  }

  private loadData() {
    try {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(this.dbPath)) {
        const data = fs.readFileSync(this.dbPath, 'utf-8');
        this.prescripciones = JSON.parse(data);
        this.nextId = Math.max(...this.prescripciones.map(p => p.id), 0) + 1;
      } else {
        this.saveData();
      }
    } catch (error) {
      this.logger.error('Error cargando datos:', error);
      this.prescripciones = [];
    }
  }

  private saveData() {
    fs.writeFileSync(this.dbPath, JSON.stringify(this.prescripciones, null, 2));
  }

  async crearPrescripcion(createDto: {
    pacienteId: string;
    pacienteNombre: string;
    medicoId: string;
    medicoNombre: string;
    medicamentos: Medicamento[];
    diasValidez?: number;
  }): Promise<Prescripcion> {
    const fechaPrescripcion = new Date();
    const fechaVencimiento = new Date(fechaPrescripcion);
    const diasValidez = createDto.diasValidez || 30; // 30 días por defecto
    fechaVencimiento.setDate(fechaVencimiento.getDate() + diasValidez);

    const prescripcion: Prescripcion = {
      id: this.nextId++,
      pacienteId: createDto.pacienteId,
      pacienteNombre: createDto.pacienteNombre,
      medicoId: createDto.medicoId,
      medicoNombre: createDto.medicoNombre,
      fechaPrescripcion: fechaPrescripcion.toISOString(),
      fechaVencimiento: fechaVencimiento.toISOString(),
      medicamentos: createDto.medicamentos,
      estado: 'pendiente',
    };

    this.prescripciones.push(prescripcion);
    this.saveData();

    // Emitir evento a n8n
    await this.webhookEmitter.emit('prescripcion.registrada', prescripcion, {
      paciente: createDto.pacienteNombre,
      medico: createDto.medicoNombre,
      cantidadMedicamentos: createDto.medicamentos?.length || 0,
    });

    this.logger.log(`Prescripción creada: ${prescripcion.id} para ${prescripcion.pacienteNombre}`);
    return prescripcion;
  }

  async surtirPrescripcion(id: number, farmacia: string, precioTotal: number): Promise<Prescripcion> {
    const prescripcion = this.prescripciones.find(p => p.id === id);
    if (!prescripcion) {
      throw new NotFoundException(`Prescripción ${id} no encontrada`);
    }

    if (prescripcion.estado === 'vencida') {
      throw new Error('No se puede surtir una prescripción vencida');
    }

    prescripcion.estado = 'surtida';
    prescripcion.farmaciaRecomendada = farmacia;
    prescripcion.precioTotal = precioTotal;
    this.saveData();

    // Emitir evento
    await this.webhookEmitter.emit('prescripcion.surtida', prescripcion, {
      paciente: prescripcion.pacienteNombre,
      farmacia,
      precioTotal,
    });

    this.logger.log(`Prescripción surtida: ${prescripcion.id} en ${farmacia}`);
    return prescripcion;
  }

  async verificarPrescripcionesVencidas(): Promise<Prescripcion[]> {
    const ahora = new Date();
    const vencidas: Prescripcion[] = [];

    for (const prescripcion of this.prescripciones) {
      if (prescripcion.estado === 'pendiente') {
        const fechaVencimiento = new Date(prescripcion.fechaVencimiento);
        if (fechaVencimiento < ahora) {
          prescripcion.estado = 'vencida';
          vencidas.push(prescripcion);

          const diasVencidos = Math.floor(
            (ahora.getTime() - fechaVencimiento.getTime()) / (1000 * 60 * 60 * 24)
          );

          // Emitir evento crítico
          await this.webhookEmitter.emit('prescripcion.vencida', prescripcion, {
            paciente: prescripcion.pacienteNombre,
            diasVencidos,
            medicamentos: prescripcion.medicamentos.length,
          });
        }
      }
    }

    if (vencidas.length > 0) {
      this.saveData();
      this.logger.warn(`${vencidas.length} prescripciones vencidas detectadas`);
    }

    return vencidas;
  }

  listarPrescripciones(): Prescripcion[] {
    return this.prescripciones.map(p => this.calcularDiasRestantes(p));
  }

  obtenerPrescripcion(id: number): Prescripcion {
    const prescripcion = this.prescripciones.find(p => p.id === id);
    if (!prescripcion) {
      throw new NotFoundException(`Prescripción ${id} no encontrada`);
    }
    return this.calcularDiasRestantes(prescripcion);
  }

  private calcularDiasRestantes(prescripcion: Prescripcion): Prescripcion {
    if (prescripcion.estado === 'pendiente') {
      const ahora = new Date();
      const fechaVencimiento = new Date(prescripcion.fechaVencimiento);
      const diff = fechaVencimiento.getTime() - ahora.getTime();
      const diasRestantes = Math.ceil(diff / (1000 * 60 * 60 * 24));
      
      return {
        ...prescripcion,
        diasRestantes,
      };
    }
    return prescripcion;
  }
}
