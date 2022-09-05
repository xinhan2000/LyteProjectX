import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { client } from "./client"

@Entity()
export class client_web_hooks {
    @PrimaryGeneratedColumn()
    pk: number

    @Column("varchar", { length: 255 })
    name: string

    @Column("varchar", { length: 255 })
    event: string

    @Column("varchar", { length: 255 })
    callback_url: string

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updateDate: Date

    @ManyToOne(() => client, (client) => client.web_hooks)
    client: client
}