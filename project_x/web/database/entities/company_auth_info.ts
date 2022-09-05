import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { company } from "./company"

@Entity()
export class company_auth_info {
    @PrimaryGeneratedColumn()
    pk: number

    @Column("varchar", { length: 1024 })
    endpoint: string

    @Column("varchar", { length: 1024 })
    refresh_token_endpoint: string

    @Column("varchar", { length: 255 })
    grant_type: string

    @Column("varchar", { length: 255 })
    client_id: string

    @Column("varchar", { length: 255 })
    client_secret: string

    @Column("varchar", { length: 1024 })
    redirect_url: string

    @Column("varchar", { length: 1024 })
    scope: string

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updateDate: Date

    @OneToOne(() => company)
    company: company
}