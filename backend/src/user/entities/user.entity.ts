// src/user/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { CreditCardEntity } from './card.entity'

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  // Establishing a one-to-one relationship with CreditCardEntity using email as the foreign key
  @OneToOne(() => CreditCardEntity)
  @JoinColumn()
  creditCard: CreditCardEntity;
}


