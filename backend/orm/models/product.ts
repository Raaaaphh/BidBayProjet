import { DataTypes } from 'sequelize'
import {Table, Column, Model, HasMany, BelongsTo} from 'sequelize-typescript';
import {User} from "./user.js";
import {Bid} from "./bid.js";

@Table
export class Product extends Model {

  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  })
  declare id: string

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  })
  declare name: string

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  })
  declare description: string

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  })
  declare category: string

  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 0
    }
  })
  declare originalPrice: number

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  })
  declare pictureUrl: string

  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true
    }
  })
  declare endDate: Date

  @Column({
    type: DataTypes.UUID,
    allowNull: false
  })
  declare sellerId: string

  @BelongsTo(() => User, {foreignKey: 'sellerId'})
  declare seller: Awaited<User>;

  @HasMany(() => Bid, {foreignKey: 'productId', onDelete: 'CASCADE'})
  declare bids: Awaited<Bid[]>;
}
