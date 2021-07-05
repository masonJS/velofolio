import {Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn} from 'typeorm'
import { StockMeta } from './StockMeta'
import {StockType} from "./StockType";
@Entity({
  name: 'stocks'
})
export class Stock{
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: "varchar",
    length: 10
  })
  ticker: string

  @Column({
    type: 'varchar',
    length: 4096
  })
  description: string

  @Column()
  sector: string

  @Column({ type: 'timestamp' })
  ipo_date: Date

  @Column({ nullable: true })
  image: string

  @Column()
  is_etf: boolean

  @OneToOne(type => StockMeta, (stockMeta) => stockMeta.stock)
  stock_meta: StockMeta

  @ManyToOne(type => StockType, { cascade: true })
  @JoinColumn({
    name: 'stock_type_id'
  })
  stock_type: StockType

}
