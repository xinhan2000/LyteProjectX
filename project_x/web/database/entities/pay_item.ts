import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { user_payout } from "./user_payout";

@Entity()
export class pay_item {
    @PrimaryGeneratedColumn()
    pk: number

    @Column("varchar", { length: 255 })
    name: string;

    @Column("varchar", { length: 255 })
    period: string;

    @Column("varchar", { length: 255 })
    ytd: string;

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updateDate: Date

    @ManyToOne(() => user_payout, (user_payout) => user_payout.pay_items)
    user_payout: user_payout
}