import authMiddleware from '../middlewares/auth'
import { Bid, Product } from '../orm/index.js';
import express from 'express';
import { getDetails } from '../validators/index.js';
import { Request } from 'express';

const router = express.Router()

router.delete('/api/bids/:bidId', authMiddleware, async (req: Request<{ bidId: string }, { error: string; details?: string[] }, Record<string, never>>, res) => {
  if (!req.user) return res.status(401).send({ error: 'Unauthorized', details: ['You must be logged in to delete a bid'] });

  const { bidId } = req.params
  const bid = await Bid.findByPk(bidId)
  if (!bid) return res.status(404).send({ error: 'Bid not found', details: ['The bid you are trying to delete does not exist'] });

  if (bid.bidderId !== req.user.id && !req.user.admin) return res.status(403).send({ error: 'Forbidden', details: ['You are not allowed to delete this bid'] });

  await bid.destroy()

  res.status(204).send()
})

router.post('/api/products/:productId/bids', authMiddleware, async (req: Request<{ productId: string }, { error: string; details?: string[] } | {
  id: string,
  productId: string,
  price: number,
  date: Date,
  bidderId: string
}, { price: number }>, res) => {
  if (!req.user) return res.status(401).send({ error: 'Unauthorized', details: ['You must be logged in to place a bid'] });

  try {
    const { productId } = req.params;
    const { price } = req.body

    if (!req.body.price) return res.status(400).send({
      error: 'Invalid or missing fields',
      details: ['Price is required']
    });
    const product = await Product.findByPk(productId)
    if (!product) return res.status(404).send({ error: 'Product not found', details: ['The product you are trying to bid on does not exist'] });


    if (product.sellerId === req.user.id) return res.status(400).send({
      error: 'Invalid or missing fields',
      details: ['You cannot bid on your own product']
    })

    const highestBid = await Bid.findOne({
      where: {
        productId: productId
      },
      order: [['price', 'DESC']]
    })

    if (highestBid && price <= highestBid.price) {
      return res.status(400).send({
        error: 'Invalid or missing fields',
        details: ['Your bid must be higher than the current highest bid']
      })
    }

    const bid = await Bid.create({
      price: price,
      productId: productId,
      bidderId: req.user.id,
      date: new Date()
    })
    const response = {
      id: bid.id,
      productId: bid.productId,
      price: bid.price,
      date: bid.createdAt,
      bidderId: req.user.id
    }
    console.log(response)
    res.status(201).json(response)
  } catch (e) {
    res.status(500).send({
      error: 'Internal server error', details: getDetails(e as Error)
    })
  }

})

export default router
