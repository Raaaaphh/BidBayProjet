import express from 'express'
import { User, Product, Bid } from '../orm/index.js'
import { Request } from 'express'
const router = express.Router()

router.get('/api/users/:userId', async (req: Request<{ userId: string }, { error: string; details?: string[] } | User, Record<string, never>>, res) => {
  const { userId } = req.params
  const user = await User.findByPk(userId, {
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

  if (user) {
    user.password = "";
  } else {
    return res.status(404).send({ error: 'User not found', details: ['The user you are trying to view does not exist'] });
  }

  res.status(200).send(user)
})

export default router
