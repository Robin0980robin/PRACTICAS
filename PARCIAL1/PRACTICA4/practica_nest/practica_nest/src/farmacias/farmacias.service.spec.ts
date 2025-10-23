import { Test, TestingModule } from '@nestjs/testing';
import { FarmaciasService } from './farmacias.service';

describe('FarmaciasService', () => {
  let service: FarmaciasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FarmaciasService],
    }).compile();

    service = module.get<FarmaciasService>(FarmaciasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
