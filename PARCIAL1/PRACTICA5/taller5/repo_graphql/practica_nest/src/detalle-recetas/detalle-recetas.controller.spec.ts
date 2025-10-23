import { Test, TestingModule } from '@nestjs/testing';
import { DetalleRecetasController } from './detalle-recetas.controller';
import { DetalleRecetasService } from './detalle-recetas.service';

describe('DetalleRecetasController', () => {
  let controller: DetalleRecetasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetalleRecetasController],
      providers: [DetalleRecetasService],
    }).compile();

    controller = module.get<DetalleRecetasController>(DetalleRecetasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
