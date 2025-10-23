import { Test, TestingModule } from '@nestjs/testing';
import { DetallePrescripcionesController } from './detalle-prescripciones.controller';
import { DetallePrescripcionesService } from './detalle-prescripciones.service';

describe('DetallePrescripcionesController', () => {
  let controller: DetallePrescripcionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetallePrescripcionesController],
      providers: [DetallePrescripcionesService],
    }).compile();

    controller = module.get<DetallePrescripcionesController>(DetallePrescripcionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
