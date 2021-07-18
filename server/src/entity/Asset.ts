import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { AssetMeta } from './AssetMeta'
import { AssetType } from "./AssetType";

@Entity({
  name: 'asset'
})
export class Asset{
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: "varchar",
    length: 10
  })
  ticker: string

  @Column({ length: 128 })
  name: string

  @Column({
    type: 'varchar',
    length: 4096
  })
  description: string

  @Column({ nullable: true })
  sector: string

  @Column({ type: 'timestamp' })
  ipo_date: Date

  @Column({ nullable: true })
  image: string

  @Column()
  is_etf: boolean

  @OneToOne((type) => AssetMeta, (assetMeta) => assetMeta.asset)
  asset_meta: AssetMeta

  @ManyToOne((type) => AssetType, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'asset_type_id'
  })
  asset_type: AssetType

}
