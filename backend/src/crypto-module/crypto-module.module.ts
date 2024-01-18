import { Module } from '@nestjs/common';
import { CryptoModuleService } from './crypto-module.service';
import { CryptoModuleController } from './crypto-module.controller';
import { AwsKmsService } from './Aws.service';

@Module({
  controllers: [CryptoModuleController],
  providers: [CryptoModuleService,AwsKmsService],
})
export class CryptoModuleModule {}
