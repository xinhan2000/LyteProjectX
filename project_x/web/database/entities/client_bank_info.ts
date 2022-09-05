import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { client } from "./client"

export enum AccountType {
    CHECHKING = "checking",
    SAVING = "saving",
}

@Entity()
export class client_bank_info {
    @PrimaryGeneratedColumn()
    pk: number

    @Column("varchar", { length: 255 })
    name: string

    @Column("varchar", { length: 255 })
    routing_number: string

    @Column("varchar", { length: 255 })
    account_number: string

    @Column({
        type: "enum",
        enum: AccountType,
    })
    account_type: AccountType

    @Column()
    is_default: boolean

    @Column("varchar", { length: 1024, nullable: true })
    address: string

    @Column("varchar", { length: 1024, nullable: true })
    website: string

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updateDate: Date

    @ManyToOne(() => client, (client) => client.banks)
    client: client
}