import {Entity, PrimaryGeneratedColumn, Column, OneToOne, Index} from 'typeorm'
@Entity({
  name: 'stock_type'
})
export class StockType {
  @PrimaryGeneratedColumn()
  id: number

  @Index()
  @Column({ length: 32 })
  type: string
}
