import express from 'express'
import { User, Product, Bid } from '../orm/index.js'

const router = express.Router()

router.get('/api/users/:userId', async (req, res) => {

  const user = await User.findByPk(req.params.userId, {
    include: [
      {
        model: Product,
        as: 'products'
      },
      {
        model: Bid,
        as: 'bids',
        include: [
          {
            model: Product,
            as: 'product'
          }
        ]
      }
    ]

  })
  if (!user) return res.status(404).send('User not found')

  res.status(200).send(user)
})

export default router
