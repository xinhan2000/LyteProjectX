import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class user_auth_info {
    @PrimaryGeneratedColumn()
    pk: number

    @Column()
    userPk: number

    @Column()
    clientPk: number

    @Column()
    companyPk: number

    @Column("varchar", { length: 255, nullable: true })
    token_type: string

    @Column("varchar", { length: 255 })
    access_token: string

    @Column("varchar", { length: 255 })
    refresh_token: string

    @Column()
    expires_in: number

    @Column("varchar", { length: 255, nullable: true })
    uid_at_company: string

    @Column("varchar", { length: 255, nullable: true })
    info: string

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updateDate: Date
}