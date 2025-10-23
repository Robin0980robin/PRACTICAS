import { Controller, Get, Post, Body } from '@nestjs/common';
@Controller('usuarios')
export class UsuariosController {
 constructor(private readonly usuariosService) {}
 @Post()
 create(@Body() createUsuarioDto) {
 return this.usuariosService.create(createUsuarioDto);
 }
}