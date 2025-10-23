import { Test, TestingModule } from '@nestjs/testing';
import { FarmaciasController } from './farmacias.controller';
import { FarmaciasService } from './farmacias.service';

describe('FarmaciasController', () => {
  let controller: FarmaciasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmaciasController],
      providers: [FarmaciasService],
    }).compile();

    controller = module.get<FarmaciasController>(FarmaciasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
