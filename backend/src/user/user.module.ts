import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CreditCardEntity } from './entities/card.entity';
import { AwsKmsService } from './Aws.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, CreditCardEntity])],
  controllers: [UserController],
  providers: [UserService, AwsKmsService],
})
export class UserModule {}
