import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map } from 'rxjs';
import { Usuario } from '../types/usuario.type';

@Injectable()
export class UsuariosRestService {
    private readonly apiUrl = 'http://localhost:3000';

    constructor(private readonly httpService: HttpService) {}

    findAll(): Observable<Usuario[]> {
        return this.httpService
            .get(`${this.apiUrl}/usuarios`)
            .pipe(map((response) => response.data));
    }

    findOne(id: number): Observable<Usuario> {
        return this.httpService
            .get(`${this.apiUrl}/usuarios/${id}`)
            .pipe(map((response) => response.data));
    }
}