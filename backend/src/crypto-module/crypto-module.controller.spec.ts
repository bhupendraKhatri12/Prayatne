import { Test, TestingModule } from '@nestjs/testing';
import { CryptoModuleController } from './crypto-module.controller';
import { CryptoModuleService } from './crypto-module.service';

describe('CryptoModuleController', () => {
  let controller: CryptoModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoModuleController],
      providers: [CryptoModuleService],
    }).compile();

    controller = module.get<CryptoModuleController>(CryptoModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
