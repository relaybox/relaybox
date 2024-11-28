import { Entity, Column, Index, PrimaryColumn, Unique } from 'typeorm';

@Entity('asset_users')
@Index('IDX_asset_users_assetId', ['assetId'])
@Index('IDX_asset_users_deletedAt', ['deletedAt'])
export class AssetUser {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  assetId: string;

  @Column()
  clientId: string;

  @Column()
  uid: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
