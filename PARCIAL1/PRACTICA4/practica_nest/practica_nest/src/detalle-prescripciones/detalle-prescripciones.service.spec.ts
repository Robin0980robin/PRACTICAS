import { Test, TestingModule } from '@nestjs/testing';
import { DetallePrescripcionesService } from './detalle-prescripciones.service';

describe('DetallePrescripcionesService', () => {
  let service: DetallePrescripcionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetallePrescripcionesService],
    }).compile();

    service = module.get<DetallePrescripcionesService>(DetallePrescripcionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
