import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { Usuario } from '../types/usuario.type';
import { UsuariosRestService } from '../services/usuarios-rest.service';

@Resolver(() => Usuario)
export class UsuariosResolver {
    constructor(private readonly usuariosService: UsuariosRestService) {}

    @Query(() => [Usuario])
    async usuarios(): Promise<Usuario[]> {
        const result = await this.usuariosService.findAll().toPromise();
        if (!result) throw new Error('No se encontraron usuarios');
        return result;
    }

    @Query(() => Usuario)
    async usuario(@Args('id', { type: () => ID }) id: number): Promise<Usuario> {
        const result = await this.usuariosService.findOne(id).toPromise();
        if (!result) throw new Error(`Usuario con ID ${id} no encontrado`);
        return result;
    }
}