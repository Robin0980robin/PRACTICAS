import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoriaType } from '../types/categoria.type';

@Injectable()
export class CategoriasRestService {
  private readonly apiUrl = 'http://localhost:3000/categorias';

  constructor(private readonly httpService: HttpService) {}

  findAll(): Observable<CategoriaType[]> {
    return this.httpService.get(this.apiUrl).pipe(
      map(response => response.data),
    );
  }

  findOne(id: number): Observable<CategoriaType> {
    return this.httpService.get(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
    );
  }
}