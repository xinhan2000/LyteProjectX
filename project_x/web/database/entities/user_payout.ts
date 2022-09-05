import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { pay_summary } from "./pay_summary"
import { pay_item } from "./pay_item"
import { pay_activity } from "./pay_activity"

@Entity()
export class user_payout {
    @PrimaryGeneratedColumn()
    pk: number

    @Column()
    userPk: number

    @Column()
    clientPk: number

    @Column()
    companyPk: number

    @Column()
    employerPk: number

    @Column()
    pay_date: Date

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updateDate: Date

    @OneToOne(() => pay_summary)
    @JoinColumn()
    pay_summary: pay_summary

    @OneToMany(() => pay_item, (pay_item) => pay_item.user_payout)
    pay_items: pay_item[]

    @OneToMany(() => pay_activity, (pay_activity) => pay_activity.user_payout)
    pay_activities: pay_activity[]
}