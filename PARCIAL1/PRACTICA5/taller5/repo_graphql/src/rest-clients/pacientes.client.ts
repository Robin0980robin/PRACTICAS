import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Paciente } from '../analytics/types/paciente.type';

@Injectable()
export class PacientesClient {
    constructor(private readonly httpService: HttpService) {}

    async findAll(): Promise<Paciente[]> {
        const response = await firstValueFrom(this.httpService.get('/api/pacientes'));
        return response.data;
    }

    async findOne(id: number): Promise<Paciente> {
        const response = await firstValueFrom(this.httpService.get(`/api/pacientes/${id}`));
        return response.data;
    }

    async findByCriteria(criteria: any): Promise<Paciente[]> {
        const response = await firstValueFrom(this.httpService.post('/api/pacientes/search', criteria));
        return response.data;
    }
}