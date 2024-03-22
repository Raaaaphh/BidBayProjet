import { Sequelize } from 'sequelize-typescript';
import {Product} from "./models/product.js";
import {Bid} from "./models/bid.js";
import {User} from "./models/user.js";

export const sequelize = new Sequelize({
    database: 'db',
    dialect: 'sqlite',
    storage: ':memory:',
    models: [Bid, Product, User],
})
