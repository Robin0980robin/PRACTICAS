import { Args, ID, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Receta } from '../types/receta.type';
import { RecetasRestService } from '../services/recetas-rest.service';
import { Medico } from '../types/medico.type';
import { Paciente } from '../types/paciente.type';

@Resolver(() => Receta)
export class RecetasResolver {
    constructor(private readonly recetasService: RecetasRestService) {}

    @Query(() => [Receta])
    async recetas(): Promise<Receta[]> {
        const result = await this.recetasService.findAll().toPromise();
        if (!result) throw new Error('No se encontraron recetas');
        return result;
    }

    @Query(() => Receta)
    async receta(@Args('id', { type: () => ID }) id: number): Promise<Receta> {
        const result = await this.recetasService.findOne(id).toPromise();
        if (!result) throw new Error(`Receta con ID ${id} no encontrada`);
        return result;
    }

    @Query(() => [Receta])
    async recetasPorMedico(
        @Args('medicoId', { type: () => ID }) medicoId: number,
    ): Promise<Receta[]> {
        const result = await this.recetasService.findByMedico(medicoId).toPromise();
        if (!result) throw new Error(`No se encontraron recetas para el médico con ID ${medicoId}`);
        return result;
    }

    @Query(() => [Receta])
    async recetasPorPaciente(
        @Args('pacienteId', { type: () => ID }) pacienteId: number,
    ): Promise<Receta[]> {
        const result = await this.recetasService.findByPaciente(pacienteId).toPromise();
        if (!result) throw new Error(`No se encontraron recetas para el paciente con ID ${pacienteId}`);
        return result;
    }
}