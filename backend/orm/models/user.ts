import { DataTypes } from 'sequelize'
import {Table, Column, Model, HasMany} from 'sequelize-typescript';
import {Product} from "./product.js";
import {Bid} from "./bid.js";

@Table
export class User extends Model {

  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  })
  declare id: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  })
  declare username: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  })
  declare email: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  })
  declare password: string;

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    validate: {
      isBoolean: true
    }
  })
  declare admin: boolean;

  @HasMany(() => Product, {foreignKey: 'sellerId', onDelete: 'CASCADE'})
  declare products: Awaited<Product[]>;

  @HasMany(() => Bid, {foreignKey: 'bidderId', onDelete: 'CASCADE'})
  declare bids: Awaited<Bid[]>;
}
