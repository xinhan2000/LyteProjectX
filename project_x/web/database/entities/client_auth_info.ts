import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { client } from "./client"

export enum ClientAuthEnv {
    PROD = "prod",
    SANDBOX = "sandbox",
}

@Entity()
export class client_auth_info {
    @PrimaryGeneratedColumn()
    pk: number

    @Column({
        type: "enum",
        enum: ClientAuthEnv,
    })
    env: ClientAuthEnv

    @Column("varchar", { length: 255 })
    name: string

    @Column("varchar", { length: 1024 })
    endpoint: string

    @Column("varchar", { length: 255 })
    api_key: string

    @Column("varchar", { length: 255 })
    client_secret: string

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updateDate: Date

    @ManyToOne(() => client, (client) => client.auths)
    client: client
}