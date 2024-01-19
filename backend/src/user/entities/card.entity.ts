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
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({nullable:false})
  creditCardNumber: string;

  @Column({ nullable: false })
  intialVector: string;

  @Column({ default: '', nullable: false })
  encrpytedDataKey: string;
}
