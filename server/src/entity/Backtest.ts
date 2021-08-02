import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany, JoinTable
} from 'typeorm'
import { User } from "./User";
import { Asset } from "./Asset";

@Entity({
  name: 'backtests'
})
export class Backtest {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  title!: string

  @Column({ type: 'text' })
  body!: string

  @Index()
  @CreateDateColumn()
  @Column({ type: 'timestamp' })
  created_at!: Date

  @Column({ type: 'text' })
  options!: string

  @Column()
  is_certified!: boolean

  @ManyToOne(type => User)
  @JoinColumn({ name: 'user_id'})
  user!: User

  @ManyToMany(type => Asset)
  @JoinTable({
    name: 'backtest_asset',
    joinColumn: {
      name: 'backtest_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'asset_id',
      referencedColumnName: 'id'
    }
  })
  asset!: Asset[]
}
