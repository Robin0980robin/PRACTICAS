import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map } from 'rxjs';
import { Receta } from '../types/receta.type';

@Injectable()
export class RecetasRestService {
    private readonly apiUrl = 'http://localhost:3000';

    constructor(private readonly httpService: HttpService) {}

    findAll(): Observable<Receta[]> {
  return this.httpService
    .get(`${this.apiUrl}/recetas`)
    .pipe(map((response) => response.data.data)); // 👈 nota el .data extra
}

    findOne(id: number): Observable<Receta> {
        return this.httpService
            .get(`${this.apiUrl}/recetas/${id}`)
            .pipe(map((response) => response.data));
    }

    findByMedico(medicoId: number): Observable<Receta[]> {
        return this.httpService
            .get(`${this.apiUrl}/recetas?medicoId=${medicoId}`)
            .pipe(map((response) => response.data));
    }

    findByPaciente(pacienteId: number): Observable<Receta[]> {
        return this.httpService
            .get(`${this.apiUrl}/recetas?pacienteId=${pacienteId}`)
            .pipe(map((response) => response.data));
    }
}