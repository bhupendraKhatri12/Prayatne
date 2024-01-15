// src/user/dto/create-user.dto.ts
import { IsString, IsEmail, IsCreditCard } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsCreditCard()
  creditCardNumber: string;
}
