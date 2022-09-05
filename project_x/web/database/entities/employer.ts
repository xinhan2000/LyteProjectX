import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { company } from "./company"

@Entity()
export class employer {
    @PrimaryGeneratedColumn()
    pk: number

    @Column("varchar", { length: 255 })
    name: string

    @Column()
    is_company: boolean

    @CreateDateColumn()
    createdDate: Date

    @ManyToOne(() => company, (company) => company.employers)
    company: company
}