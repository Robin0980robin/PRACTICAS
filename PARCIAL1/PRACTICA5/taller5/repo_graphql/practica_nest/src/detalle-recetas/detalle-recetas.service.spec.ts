import { Test, TestingModule } from '@nestjs/testing';
import { DetalleRecetasService } from './detalle-recetas.service';

describe('DetalleRecetasService', () => {
  let service: DetalleRecetasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetalleRecetasService],
    }).compile();

    service = module.get<DetalleRecetasService>(DetalleRecetasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
