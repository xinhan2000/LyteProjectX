import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { client } from "./client"

export enum GENDER {
    MALE = "male",
    FEMALE = "female",
    UNKNOWN = "unknown",
}

@Entity()
export class user {
    @PrimaryGeneratedColumn()
    pk: number

    @Column("varchar", { length: 255 })
    user_id: string

    @Column("varchar", { length: 255 })
    name: string

    @Column()
    birth: Date

    @Column("varchar", { length: 255 })
    ssn: string

    @Column({
        type: "enum",
        enum: GENDER,
    })
    gender: GENDER

    @Column("varchar", { length: 255 })
    email: string

    @Column("varchar", { length: 255 })
    phone: string

    @Column("varchar", { length: 1024 })
    address: string

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updateDate: Date

    @ManyToMany(() => client, (client) => client.users)
    @JoinTable({ name: "user_client_mapping" })
    clients: client[]
}