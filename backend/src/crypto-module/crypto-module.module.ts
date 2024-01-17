import { Module } from '@nestjs/common';
import { CryptoModuleService } from './crypto-module.service';
import { CryptoModuleController } from './crypto-module.controller';

@Module({
  controllers: [CryptoModuleController],
  providers: [CryptoModuleService],
})
export class CryptoModuleModule {}
