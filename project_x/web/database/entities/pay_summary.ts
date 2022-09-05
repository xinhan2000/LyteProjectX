import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { user_payout } from "./user_payout";

@Entity()
export class pay_summary {
    @PrimaryGeneratedColumn()
    pk: number

    @Column("decimal", { precision: 19, scale: 4 })
    hours: number;

    @Column("decimal", { precision: 19, scale: 4 })
    gross: number;

    @Column("decimal", { precision: 19, scale: 4 })
    reimbursement: number;

    @Column("decimal", { precision: 19, scale: 4 })
    deduct: number;

    @Column("decimal", { precision: 19, scale: 4 })
    ytd_paid: number;

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updateDate: Date

    @OneToOne(() => user_payout)
    user_payout: user_payout
}