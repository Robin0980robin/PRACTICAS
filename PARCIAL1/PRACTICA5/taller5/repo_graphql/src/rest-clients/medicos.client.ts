import { Injectable, HttpService } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Medico } from '../analytics/types/medico.type';

@Injectable()
export class MedicosClient {
    constructor(private readonly httpService: HttpService) {}

    /**
     * Fetch all medicos from the REST service.
     * @returns An observable of an array of Medico.
     */
    findAll(): Observable<Medico[]> {
        return this.httpService.get<Medico[]>('https://api.example.com/medicos');
    }

    /**
     * Fetch a medico by ID from the REST service.
     * @param id The ID of the medico to fetch.
     * @returns An observable of a Medico.
     */
    findOne(id: number): Observable<Medico> {
        return this.httpService.get<Medico>(`https://api.example.com/medicos/${id}`);
    }

    /**
     * Fetch medicos by specialty from the REST service.
     * @param specialty The specialty to filter medicos by.
     * @returns An observable of an array of Medico.
     */
    findBySpecialty(specialty: string): Observable<Medico[]> {
        return this.httpService.get<Medico[]>(`https://api.example.com/medicos?specialty=${specialty}`);
    }
}