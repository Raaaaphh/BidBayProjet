import authMiddleware from '../middlewares/auth'
import { Bid, Product } from '../orm/index.js'
import express from 'express'
import { getDetails } from '../validators/index.js'
import { error } from 'console'

const router = express.Router()

router.delete('/api/bids/:bidId', authMiddleware, async (req, res) => {
  if (!req.user) return res.status(401).send('Unauthorized');

  const bid = await Bid.findByPk(req.params.bidId)
  if (!bid) return res.status(404).send('Bid not found')

  if (bid.bidderId !== req.user.id && !req.user.admin) return res.status(403).send('Forbidden')

  await bid.destroy()

  res.status(204).send()
})

router.post('/api/products/:productId/bids', authMiddleware, async (req, res) => {
  if (!req.user) return res.status(401).send('Unauthorized');

  if (!getDetails(req.body)) return res.status(400).send('Invalid input')
  if (!req.body.price) return res.status(400).send({
    error: 'Invalid or missing fields',
    details: 'Price is required'
  });
  const product = await Product.findByPk(req.params.productId)
  if (!product) return res.status(404).send('Product not found')


  if (product.sellerId === req.user.id) return res.status(400).send({
    error: 'Invalid or missing fields',
    details: 'You cannot bid on your own product'
  })

  const highestBid = await Bid.findOne({
    where: {
      productId: req.params.productId
    },
    order: [['price', 'DESC']]
  })

  if (highestBid && req.body.price <= highestBid.price) {
    return res.status(400).send({
      error: 'Invalid or missing fields',
      details: 'Price must be higher than the current highest bid'
    })
  }

  const bid = await Bid.create({
    price: req.body.price,
    productId: req.params.productId,
    bidderId: req.user.id,
    date: new Date()
  })
  const response = {
    id: bid.id,
    productID: bid.productId,
    price: bid.price,
    date: bid.createdAt,
    bidderId: req.user.id
  }
  res.status(201).json(response)
})

export default router
