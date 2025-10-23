import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface VentaType {
  id: number;
  producto: string;
  cantidad: number;
  precio: number;
  fecha: string;
  total;
}

@Injectable()
export class VentasRestService {
  private readonly apiUrl = 'http://localhost:3000/ventas';

  constructor(private readonly httpService: HttpService) {}

  findAll(): Observable<VentaType[]> {
    return this.httpService.get(this.apiUrl).pipe(
      map(response => response.data),
    );
  }

  findOne(id: number): Observable<VentaType> {
    return this.httpService.get(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
    );
  }

  findByPeriodo(mes: number, anio: number): Promise<VentaType[]> {
    return this.httpService.get(`${this.apiUrl}/periodo/${mes}/${anio}`).pipe(
      map(response => response.data),
    ).toPromise();
  }
}