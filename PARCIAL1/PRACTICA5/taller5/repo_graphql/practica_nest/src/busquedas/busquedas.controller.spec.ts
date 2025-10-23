import { Test, TestingModule } from '@nestjs/testing';
import { BusquedasController } from './busquedas.controller';
import { BusquedasService } from './busquedas.service';

describe('BusquedasController', () => {
  let controller: BusquedasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusquedasController],
      providers: [BusquedasService],
    }).compile();

    controller = module.get<BusquedasController>(BusquedasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
