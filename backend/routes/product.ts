import express from 'express'
import { Product, Bid, User } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'
import { getDetails } from '../validators/index.js'

const router = express.Router()

router.get('/api/products', async (req, res, next) => {
  res.status(600).send()
})

router.get('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

// You can use the authMiddleware with req.user.id to authenticate your endpoint ;)

router.post('/api/products', authMiddleware, (req, res) => {
  if (!getDetails(req.body)) return res.status(400).send('Invalid input');

  if (req.user) {
    Product.create({
      sellerId: req.user.id,
      ...req.body
    }).then(product => {
      res.status(201).send(product)
    }).catch(err => {
      res.status(400).send(err)
    });
  }
})

router.put('/api/products/:productId', async (req, res) => {

})

router.delete('/api/products/:productId', async (req, res) => {

})

export default router
