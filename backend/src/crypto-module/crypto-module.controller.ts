import { Controller } from '@nestjs/common';
import { CryptoModuleService } from './crypto-module.service';

@Controller('crypto-module')
export class CryptoModuleController {
  constructor(private readonly cryptoModuleService: CryptoModuleService) {}
}
