import {User} from './models/user.js'
import {Bid} from './models/bid.js'
import {Product} from './models/product.js'
import { sequelize } from './database.js'

export async function initializeDatabase () {
  return await sequelize.sync()
}

export { User, Bid, Product }
