import { ToolDefinition } from './types';
import { backendClient } from '../services/backend-client';

export const registrarPrescripcionTool: ToolDefinition = {
  name: 'registrar_prescripcion',
  description: 'Registra una nueva prescripción médica en el sistema con medicamentos y datos del paciente',
  inputSchema: {
    type: 'object',
    properties: {
      pacienteId: {
        type: 'string',
        description: 'ID único del paciente',
      },
      pacienteNombre: {
        type: 'string',
        description: 'Nombre completo del paciente',
      },
      medicoId: {
        type: 'string',
        description: 'ID del médico que prescribe',
      },
      medicoNombre: {
        type: 'string',
        description: 'Nombre del médico',
      },
      medicamentos: {
        type: 'array',
        description: 'Lista de medicamentos prescritos',
        items: {
          type: 'object',
          properties: {
            nombre: {
              type: 'string',
              description: 'Nombre del medicamento',
            },
            dosis: {
              type: 'string',
              description: 'Dosis del medicamento (ej: 500mg)',
            },
            frecuencia: {
              type: 'string',
              description: 'Frecuencia de administración (ej: cada 8 horas)',
            },
            duracionDias: {
              type: 'number',
              description: 'Duración del tratamiento en días',
            },
            cantidad: {
              type: 'number',
              description: 'Cantidad total de unidades',
            },
          },
          required: ['nombre', 'dosis', 'frecuencia', 'duracionDias', 'cantidad'],
        },
      },
      diasValidez: {
        type: 'number',
        description: 'Días de validez de la prescripción (opcional, por defecto 30)',
      },
    },
    required: ['pacienteId', 'pacienteNombre', 'medicoId', 'medicoNombre', 'medicamentos'],
  },

  async execute(args: any): Promise<any> {
    try {
      // Formatear medicamentos con IDs
      const medicamentosFormateados = args.medicamentos.map((med: any, index: number) => ({
        id: index + 1,
        nombre: med.nombre,
        dosis: med.dosis,
        frecuencia: med.frecuencia,
        duracionDias: med.duracionDias,
        cantidad: med.cantidad,
      }));

      const payload = {
        pacienteId: args.pacienteId,
        pacienteNombre: args.pacienteNombre,
        medicoId: args.medicoId,
        medicoNombre: args.medicoNombre,
        medicamentos: medicamentosFormateados,
        diasValidez: args.diasValidez || 30,
      };

      const response = await backendClient.post('/prescripciones', payload);

      return {
        success: true,
        message: 'Prescripción registrada exitosamente',
        data: {
          id: response.data.id,
          paciente: response.data.pacienteNombre,
          medicamentos: response.data.medicamentos.map((m: any) => m.nombre).join(', '),
          fechaPrescripcion: response.data.fechaPrescripcion,
          fechaVencimiento: response.data.fechaVencimiento,
          estado: response.data.estado,
        },
      };
    } catch (error: any) {
      console.error('Error registrando prescripción:', error.message);
      throw new Error(`Error al registrar prescripción: ${error.message}`);
    }
  },
};
