import { Resolver, Query, Args } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import { map, firstValueFrom } from 'rxjs';
import { ProductPharmacyResult } from './dto/product-pharmacy.result';
import { PaginationInput } from './dto/pagination.input';
import { PrescriptionAnalyticsResult } from './dto/prescription-analytics.result';
import { TopDoctorsResult, TopDoctor } from './dto/top-doctors.result';

@Resolver()
export class AnalyticsResolver {
  constructor(private readonly http: HttpService) {}

  /**
   * @Description Búsqueda combinada de productos y farmacias con filtros, orden y paginación.
   */
  @Query(() => [ProductPharmacyResult], { name: 'searchProductsAndPharmacies' })
  async searchProductsAndPharmacies(
    @Args('q', { type: () => String, nullable: true }) q: string,
    @Args('minPrice', { type: () => Number, nullable: true }) minPrice?: number,
    @Args('maxPrice', { type: () => Number, nullable: true }) maxPrice?: number,
    @Args('pagination', { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput,
    @Args('sortBy', { type: () => String, nullable: true }) sortBy?: string,
  ): Promise<ProductPharmacyResult[]> {
    // Consumir productos y farmacias del servicio REST
    const base = 'http://localhost:3000';
    const products$ = firstValueFrom(this.http.get(`${base}/productos`).pipe(map(r => r.data)));
    const pharmacies$ = firstValueFrom(this.http.get(`${base}/farmacias`).pipe(map(r => r.data)));

    const [products, pharmacies] = await Promise.all([products$, pharmacies$]);

    // Filtrado por query y precio
    let results: ProductPharmacyResult[] = [];
    for (const p of products) {
      if (q && !p.nombre.toLowerCase().includes(q.toLowerCase())) continue;
      if (minPrice != null && p.precio < minPrice) continue;
      if (maxPrice != null && p.precio > maxPrice) continue;

      // emparejar con farmacias donde esté disponible (simulación: todas)
      for (const f of pharmacies) {
        results.push({
          productId: p.id,
          productName: p.nombre,
          pharmacyName: f.nombre,
          pharmacyAddress: f.direccion || '',
          price: p.precio,
        });
      }
    }

    // Ordenamiento simple
    if (sortBy === 'price_asc') results.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') results.sort((a, b) => b.price - a.price);

    // Paginación
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    return results.slice(start, start + pageSize);
  }

  /**
   * @Description Analítica de recetas/prescripciones entre dos fechas: totales y items.
   */
  @Query(() => PrescriptionAnalyticsResult, { name: 'prescriptionAnalytics' })
  async prescriptionAnalytics(
    @Args('from', { type: () => String }) from: string,
    @Args('to', { type: () => String }) to: string,
  ): Promise<PrescriptionAnalyticsResult> {
    const base = 'http://localhost:3000';

    const prescriptions$ = firstValueFrom(
      this.http.get(`${base}/recetas?from=${from}&to=${to}`).pipe(map(r => r.data)),
    );
    const details$ = firstValueFrom(this.http.get(`${base}/detalle-prescripciones`).pipe(map(r => r.data)));

    const [recetas, detalles] = await Promise.all([prescriptions$, details$]);

    // Lógica de agregación: contar recetas y sumar items prescritos en el periodo
    const totalPrescriptions = recetas.length;
    const prescribedItems = detalles.filter((d: any) => {
      const date = new Date(d.fecha);
      return date >= new Date(from) && date <= new Date(to);
    }).length;

    return {
      totalPrescriptions,
      totalPrescribedItems: prescribedItems,
      periodStart: from,
      periodEnd: to,
    };
  }

  /**
   * @Description Ranking de médicos por cantidad de recetas en un rango de fechas, con paginación.
   */
  @Query(() => TopDoctorsResult, { name: 'topDoctors' })
  async topDoctors(
    @Args('from', { type: () => String }) from: string,
    @Args('to', { type: () => String }) to: string,
    @Args('pagination', { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput,
  ): Promise<TopDoctorsResult> {
    const base = 'http://localhost:3000';
    const recetas$ = firstValueFrom(this.http.get(`${base}/recetas?from=${from}&to=${to}`).pipe(map(r => r.data)));
    const medicos$ = firstValueFrom(this.http.get(`${base}/medicos`).pipe(map(r => r.data)));

    const [recetas, medicos] = await Promise.all([recetas$, medicos$]);

    // Contar recetas por médico
    const counts: Record<number, number> = {};
    for (const r of recetas) {
      counts[r.medicoId] = (counts[r.medicoId] || 0) + 1;
    }

    const list: TopDoctor[] = Object.entries(counts).map(([id, count]) => {
      const doc = medicos.find((m: any) => m.id === Number(id)) || { nombre: 'Desconocido' };
      return { doctorId: Number(id), doctorName: doc.nombre, prescriptionsCount: count } as TopDoctor;
    });

    list.sort((a, b) => b.prescriptionsCount - a.prescriptionsCount);

    const total = list.length;
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 10;
    const start = (page - 1) * pageSize;

    return { items: list.slice(start, start + pageSize), total };
  }
}
