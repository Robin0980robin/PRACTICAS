import { Injectable, HttpService } from '@nestjs/common';
import { Receta } from '../analytics/types/receta.type';
import { Medico } from '../analytics/types/medico.type';
import { Paciente } from '../analytics/types/paciente.type';

@Injectable()
export class RecetasClient {
    constructor(private readonly httpService: HttpService) {}

    async getRecetas(): Promise<Receta[]> {
        const response = await this.httpService.get('https://api.example.com/recetas').toPromise();
        return response.data;
    }

    async getRecetaById(id: number): Promise<Receta> {
        const response = await this.httpService.get(`https://api.example.com/recetas/${id}`).toPromise();
        return response.data;
    }

    async getRecetasByMedico(medicoId: number): Promise<Receta[]> {
        const response = await this.httpService.get(`https://api.example.com/recetas?medicoId=${medicoId}`).toPromise();
        return response.data;
    }

    async getRecetasByPaciente(pacienteId: number): Promise<Receta[]> {
        const response = await this.httpService.get(`https://api.example.com/recetas?pacienteId=${pacienteId}`).toPromise();
        return response.data;
    }
}