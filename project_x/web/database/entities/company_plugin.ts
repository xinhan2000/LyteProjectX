import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { company } from "./company"

export enum PluginType {
    OAUTH2 = "oauth2",
    WEB = "web",
}

@Entity()
export class company_plugin {
    @PrimaryGeneratedColumn()
    pk: number

    @Column({
        type: "enum",
        enum: PluginType,
    })
    type: PluginType

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updateDate: Date

    @ManyToOne(() => company, (company) => company.plugins)
    company: company
}