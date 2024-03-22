import { DataTypes } from 'sequelize'
import {Table, Column, Model, BelongsTo} from 'sequelize-typescript';
import {Product} from "./product.js";
import {User} from "./user.js";

@Table
export class Bid extends Model {

  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  })
  declare id: string

  @Column({
    type: DataTypes.UUID,
    allowNull: false
  })
  declare productId: string

  @Column({
    type: DataTypes.UUID,
    allowNull: false
  })
  declare bidderId: string

  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 0
    }
  })
  declare price: number

  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true
    }
  })
  declare date: Date

  @BelongsTo(() => Product, {foreignKey: 'productId'})
  declare product: Awaited<Product>;

  @BelongsTo(() => User, {foreignKey: 'bidderId'})
  declare bidder: Awaited<User>;
}
