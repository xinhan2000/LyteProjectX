import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { user_payout } from "./user_payout";

@Entity()
export class pay_activity {
    @PrimaryGeneratedColumn()
    pk: number

    @Column("varchar", { length: 1024 })
    desc: string;

    @Column()
    date: Date;

    @Column("varchar", { length: 255 })
    status: string;

    @Column("varchar", { length: 255 })
    payout_status: string;

    @Column("decimal", { precision: 19, scale: 4 })
    total_earned: number;

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updateDate: Date

    @ManyToOne(() => user_payout, (user_payout) => user_payout.pay_activities)
    user_payout: user_payout
}