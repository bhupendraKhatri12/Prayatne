import { Test, TestingModule } from '@nestjs/testing';
import { CryptoModuleService } from './crypto-module.service';

describe('CryptoModuleService', () => {
  let service: CryptoModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoModuleService],
    }).compile();

    service = module.get<CryptoModuleService>(CryptoModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
