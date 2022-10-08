import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { company } from './company';

@Entity()
export class company_auth_info {
  @PrimaryGeneratedColumn()
  pk: number;

  @Column('varchar', { unique: true, length: 255 })
  name: string;

  @Column('varchar', { length: 1024, nullable: true })
  auth_endpoint: string;

  @Column('varchar', { length: 1024 })
  token_endpoint: string;

  @Column('varchar', { length: 1024, nullable: true })
  refresh_token_endpoint: string;

  @Column('varchar', { length: 255 })
  client_id: string;

  @Column('varchar', { length: 255 })
  client_secret: string;

  @Column('varchar', { length: 1024 })
  redirect_url: string;

  @Column('varchar', { length: 1024 })
  scope: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @OneToOne(() => company)
  company: company;
}
