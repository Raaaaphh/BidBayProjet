import express from 'express';
import { Product, Bid, User } from '../orm/index.js';
import authMiddleware from '../middlewares/auth.js';
import { Request, Response } from 'express';
import { getDetails } from '../validators/index.js';
const router = express.Router()

router.get('/api/products', async (req, res: Response<Product[]>) => {
  const products = await Product.findAll(
    {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'username']
        },
        {
          model: Bid,
          as: 'bids'
        }
      ],
    }
  );
  res.status(200).json(products);
})

router.get('/api/products/:productId', async (req: Request<{ productId: string }, { error: string; details?: string[] } | Product, { productId: string }>, res) => {
  const { productId } = req.params;
  const product = await Product.findByPk(productId, {
    include: [
      {
        model: User,
        as: 'seller',
        attributes: ['id', 'username']
      },
      {
        model: Bid,
        as: 'bids',
        include: [
          {
            model: User,
            as: 'bidder',
            attributes: ['id', 'username']
          }
        ]
      }
    ]
  });

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).send({ error: 'Product not found', details: ['The product you are trying to access does not exist'] });
  }
})

router.post('/api/products', authMiddleware, (req: Request<Record<string, never>, { error: string; details?: string[] } | Product, { originalPrice: number, name: string, description: string, pictureUrl: string, category: string, endDate: string }>, res) => {
  if (!req.user) return res.status(401).send({ error: 'Unauthorized', details: ['You must be logged in to create a product'] });
  try {
    const { originalPrice, name, description, pictureUrl, category, endDate } = req.body;

    if (name.length > 255) return res.status(400).send({
      error: 'Invalid or missing fields',
      details: ['name is required and must be at most 255 characters']
    })
    if (description.length > 1000) return res.status(400).send({
      error: 'Invalid or missing fields',
      details: ['description is required and must be at most 1000 characters']
    })

    if (category.length > 255) return res.status(400).send({
      error: 'Invalid or missing fields',
      details: ['category is required and must be at most 255 characters']
    })

    Product.create({
      sellerId: req.user.id,
      originalPrice,
      name,
      description,
      pictureUrl,
      category,
      endDate
    }).then(product => {
      res.status(201).send(product)
    }).catch(err => {
      res.status(400).send(err)
    });

  } catch (e) {
    res.status(400).send({ error: 'Invalid or missing fields', details: getDetails(e as Error) });
  }
})

router.put('/api/products/:productId', authMiddleware, async (req: Request<{ productId: string }, { error: string; details?: string[] } | Product, { productId: string }>, res) => {
  if (!req.user) return res.status(401).send({ error: 'Unauthorized', details: ['You must be logged in to update a product'] });

  try {
    const { productId } = req.params;

    let product = null;

    if (req.user.admin) {
      product = await Product.findByPk(productId);
    } else {
      product = await Product.findOne({
        where: {
          id: productId
        }
      });
    }

    if (!product) return res.status(404).send({ error: 'Product not found', details: ['The product you are trying to update does not exist'] });

    if (!req.user.admin && product.sellerId !== req.user.id) return res.status(403).send({ error: 'Forbidden', details: ['You are not allowed to update this product'] });

    product.update(req.body).then(updatedProduct => {
      res.status(200).send(updatedProduct);
    }).catch(err => {
      res.status(400).send(err);
    });
  } catch (e) {
    res.status(400).send({ error: 'Invalid or missing fields', details: getDetails(e as Error) });
  }
})

router.delete('/api/products/:productId', authMiddleware, async (req: Request<Record<string, never>, { error: string; details?: string[] }, { productId: string }>, res) => {
  if (!req.user) return res.status(401).send({ error: 'Unauthorized', details: ['You must be logged in to delete a product'] });
  try {
    const { productId } = req.params;

    let product = null;

    if (req.user.admin) {
      product = await Product.findByPk(productId, {
        include: [
          {
            model: Bid,
            as: 'bids'
          }
        ]

      });
    } else {
      product = await Product.findOne({
        where: {
          id: productId
        },
        include: [
          {
            model: Bid,
            as: 'bids'
          }
        ]
      });
    }

    if (!product) return res.status(404).send({ error: 'Product not found', details: ['The product you are trying to delete does not exist'] });

    if (!req.user.admin && product.sellerId !== req.user.id) return res.status(403).send({ error: 'Forbidden', details: ['You are not allowed to delete this product'] });

    for (const bid of product.bids) {
      await bid.destroy();
    }

    product.destroy().then(() => {
      res.status(204).send();
    }).catch(err => {
      res.status(400).send(err);
    });

  } catch (e) {
    res.status(400).send({ error: 'Invalid or missing fields', details: getDetails(e as Error) });
  }
})

export default router
