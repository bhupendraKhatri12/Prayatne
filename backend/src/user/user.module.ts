import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CryptoModuleService } from '../crypto-module/crypto-module.service';
import { CryptoModuleModule } from '../crypto-module/crypto-module.module';
import { CreditCardEntity } from './entities/card.entity';
import { AwsKmsService } from '../crypto-module/Aws.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity,CreditCardEntity])],
  controllers: [UserController],
  providers: [UserService,CryptoModuleService,AwsKmsService],
})
export class UserModule {}
