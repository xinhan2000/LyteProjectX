import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { client_auth_info } from "./client_auth_info"
import { client_bank_info } from "./client_bank_info"
import { client_web_hooks } from "./client_web_hooks"
import { company } from "./company"
import { user } from "./user"

@Entity()
export class client {
    @PrimaryGeneratedColumn()
    pk: number

    @Column("varchar", { length: 255 })
    name: string

    @Column("varchar", { length: 1024 })
    address: string

    @Column("varchar", { length: 1024 })
    website: string

    @Column("varchar", { length: 255 })
    tax_id: string

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updateDate: Date

    @OneToMany(() => client_bank_info, (client_bank_info) => client_bank_info.client)
    banks: client_bank_info[]

    @OneToMany(() => client_auth_info, (client_auth_info) => client_auth_info.client)
    auths: client_auth_info[]

    @OneToMany(() => client_web_hooks, (client_web_hooks) => client_web_hooks.client)
    web_hooks: client_web_hooks[]

    @ManyToMany(() => company, (company) => company.clients)
    @JoinTable({ name: "client_company_mapping" })
    companies: company[]

    @ManyToMany(() => user, (user) => user.clients)
    users: user[]
}