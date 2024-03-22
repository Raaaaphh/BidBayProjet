import express from 'express'
import { initializeDatabase } from './orm/index.js'
import { regenerateFixtures } from './orm/fixtures/index.js'
import devRoutes from './routes/dev.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/product.js'
import userRoutes from './routes/user.js'
import bidRoutes from './routes/bid.js'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors({}))

async function main () {
  await initializeDatabase()
  await regenerateFixtures()

  app.use(devRoutes)
  app.use(authRoutes)
  app.use(productRoutes)
  app.use(userRoutes)
  app.use(bidRoutes)

  app.listen(process.env.PORT || 3000, () => {
    console.log('Server started on port 3000')
  })
}

main().catch(e => console.error(e))
