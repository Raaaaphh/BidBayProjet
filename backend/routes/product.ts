import express from 'express'
import { Product, Bid, User } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'
import { getDetails } from '../validators/index.js'

const router = express.Router()

router.get('/api/products', async (req, res, next) => {
  const products = await Product.findAll(
    {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'username']
        }
      ],
    }
  );
  res.status(200).json(products);
})

router.get('/api/products/:productId', async (req, res) => {
  const product = await Product.findByPk(req.params.productId, {
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
    res.status(404).send('Product not found');
  }
})

// You can use the authMiddleware with req.user.id to authenticate your endpoint ;)

router.post('/api/products', authMiddleware, (req, res) => {
  if (!getDetails(req.body)) return res.status(400).send('Invalid input');

  if (!req.user) return res.status(401).send('Unauthorized');

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

router.put('/api/products/:productId', authMiddleware, async (req, res) => {
  if (!getDetails(req.body)) return res.status(400).send('Invalid input');

  if (!req.user) return res.status(401).send('Unauthorized');

  let product = null;

  if (req.user.admin) {
    product = await Product.findByPk(req.params.productId);
  } else {
    product = await Product.findOne({
      where: {
        id: req.params.productId,
        sellerId: req.user.id
      }
    });
  }

  if (!product) return res.status(404).send('Product not found');

  product.update(req.body).then(updatedProduct => {
    res.status(200).send(updatedProduct);
  }).catch(err => {
    res.status(400).send(err);
  });

})

router.delete('/api/products/:productId', authMiddleware, async (req, res) => {
  if (!req.user) return res.status(401).send('Unauthorized');

  let product = null;

  if (req.user.admin) {
    product = await Product.findByPk(req.params.productId);
  } else {
    product = await Product.findOne({
      where: {
        id: req.params.productId,
        sellerId: req.user.id
      }
    });
  }

  if (!product) return res.status(404).send('Product not found');

  product.destroy().then(() => {
    res.status(204).send();
  }).catch(err => {
    res.status(400).send(err);
  });
})

export default router
