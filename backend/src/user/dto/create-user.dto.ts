// src/user/dto/create-user.dto.ts
import { IsString, IsEmail, IsCreditCard, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Length(16, 16, { message: 'Credit card number must be exactly 16 characters' })
  creditCardNumber: string;
}
