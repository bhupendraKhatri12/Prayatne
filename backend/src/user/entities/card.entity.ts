// src/credit-card/credit-card.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('creditCard')
export class CreditCardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creditCardNumber: string;

  @Column({ default: '', nullable: true })
  intialVector: string;

  @Column({ default: '', nullable: true })
  encrpytedDataKey: string;
}
