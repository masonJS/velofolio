import {Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column, Index, CreateDateColumn} from 'typeorm'
import {User} from "./User";
import {Backtest} from "./Backtest";

@Entity({
  name: 'comment'
})
export class Comment {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(type => Backtest)
  @JoinColumn({ name: 'backtest_id'})
  backtest: Backtest

  @Column({ type: 'varchar', length: 512 })
  comment: string

  @Index()
  @CreateDateColumn()
  @Column({ type: 'timestamp' })
  created_at: Date
}
