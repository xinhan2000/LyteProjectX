import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  ManyToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { employer } from './employer';
import { company_auth_info } from './company_auth_info';
import { company_plugin, PluginType } from './company_plugin';
import { client } from './client';

export enum CompanyType {
  GIG = 'gig',
  PAYROLL = 'payroll',
  OTHER = 'other',
}

@Entity()
export class company {
  @PrimaryGeneratedColumn()
  pk: number;

  @Column('varchar', { unique: true, length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: CompanyType,
  })
  type: CompanyType;

  @Column({
    type: 'enum',
    enum: PluginType,
  })
  default_plugin_type: PluginType;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @OneToMany(() => employer, (employer) => employer.company)
  employers: employer[];

  @OneToOne(() => company_auth_info)
  @JoinColumn()
  auth: company_auth_info;

  @OneToMany(() => company_plugin, (company_plugin) => company_plugin.company)
  plugins: company_plugin[];

  @ManyToMany(() => client, (client) => client.companies)
  clients: client[];
}
