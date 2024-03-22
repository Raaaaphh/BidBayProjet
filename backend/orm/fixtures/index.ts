// Attention !
// Ne modifier pas ce fichier !
// Vous risqueriez de compromettre les tests Cypress

import { Bid, Product, User } from '../index.js'

export async function regenerateFixtures () {
  await Bid.destroy({ where: { } })
  await Product.destroy({ where: { } })
  await User.destroy({ where: { } })

  const DAY = 24 * 60 * 60 * 1000

  const userAlice = await User.create({
    id: '1f2fadb1-0d7e-47a7-9d5b-ed031d665d3e',
    username: 'alice',
    email: 'alice@example.com',
    password: 'azerty',
    admin: false
  })

  const userBob = await User.create({
    id: '2f8e9450-aeab-4ece-a9bb-fb5212f28755',
    username: 'bob',
    email: 'bob@example.com',
    password: 'azerty',
    admin: false
  })

  const userCharly = await User.create({
    id: '3fedcc56-b1cf-446f-bfac-47c9d374bc18',
    username: 'charly',
    email: 'charly@example.com',
    password: 'azerty',
    admin: false
  })

  await User.create({
    id: '4f68a286-d887-4185-970a-2e8f9607550c',
    username: 'admin',
    email: 'admin@admin.org',
    password: 'admin',
    admin: true
  })

  const products = []

  products.push(await Product.create({
    name: 'Lot de dés',
    description: 'Ce lot de dés de haute qualité est parfait pour tous vos jeux de société préférés, offrant une précision et une équité de jeu exceptionnelles à chaque fois.',
    pictureUrl: 'https://image.noelshack.com/fichiers/2023/12/4/1679526253-65535-52754887718-bfd87fcc66-c-512-512-nofilter.jpg',
    category: 'Jeux',
    originalPrice: 12,
    endDate: new Date(Date.now() + 4 * DAY),
    sellerId: userBob.id
  }))

  products.push(await Product.create({
    name: 'Chapeau en poil de chameau',
    description: 'Ce chapeau en poil de chameau est un véritable chef-d\'œuvre artisanal, doux au toucher et résistant pour une durabilité à long terme.',
    pictureUrl: 'https://image.noelshack.com/fichiers/2023/12/4/1679526253-65535-51925549650-96f088a093-b-512-512-nofilter.jpg',
    category: 'Mode',
    originalPrice: 23,
    endDate: new Date(Date.now() + 10 * DAY),
    sellerId: userAlice.id
  }))

  products.push(await Product.create({
    name: 'Ampli de guitare',
    description: 'Cet ampli de guitare de haute qualité offre une puissance de sortie incroyable pour un son exceptionnel.',
    pictureUrl: 'https://image.noelshack.com/fichiers/2023/12/4/1679526253-65535-51883980423-da890ca813-b-512-512-nofilter.jpg',
    category: 'Musique',
    originalPrice: 60,
    endDate: new Date(Date.now() + 10 * DAY),
    sellerId: userAlice.id
  }))

  products.push(await Product.create({
    name: 'Rocking chair blanc',
    description: 'Détendez-vous en tout confort avec ce superbe rocking chair blanc, conçu pour ajouter une touche de charme intemporel à votre intérieur.',
    pictureUrl: 'https://image.noelshack.com/fichiers/2023/12/4/1679526253-65535-49349175631-1a86442db0-c-512-512-nofilter.jpg',
    category: 'Mobilier',
    originalPrice: 140,
    endDate: new Date(Date.now() + 5 * DAY),
    sellerId: userAlice.id
  }))

  const productCasseroles = (await Product.create({
    id: 'a0f7c522-78f8-442e-a55d-642cfe566634',
    name: 'Lot de casseroles',
    description: 'Ensemble de casseroles de qualité supérieure pour répondre à tous vos besoins culinaires.',
    pictureUrl: 'https://image.noelshack.com/fichiers/2023/12/4/1679526253-65535-51812547429-fe1cc0d832-c-512-512-nofilter.jpg',
    category: 'Cuisine',
    originalPrice: 40,
    endDate: new Date(Date.now() + 4 * DAY),
    sellerId: userAlice.id
  }))

  products.push(await Product.create({
    id: 'b0c4735c-7541-4722-87e7-a60c7b17169b',
    name: 'MacBook',
    description: 'Obtenez des performances incroyables avec ce MacBook de qualité supérieure, conçu pour une productivité sans faille et une expérience informatique exceptionnelle.',
    pictureUrl: 'https://picsum.photos/id/6/512/512',
    category: 'High-Tech',
    originalPrice: 850,
    endDate: new Date(Date.now() - 3 * DAY),
    sellerId: userAlice.id
  }))

  products.push(await Product.create({
    id: 'c07a7bdb-f3ce-41ba-b009-b29ad551d4bc',
    name: 'Escarpins blancs',
    description: 'Ajoutez une touche de sophistication à votre garde-robe avec ces superbes escarpins blancs, parfaits pour toutes les occasions, qu\'elles soient habillées ou décontractées.',
    pictureUrl: 'https://picsum.photos/id/21/512/512',
    category: 'Chaussure',
    originalPrice: 89,
    endDate: new Date(Date.now() + 14 * DAY),
    sellerId: userCharly.id
  }))

  products.push(await Product.create({
    name: 'Horloge',
    description: 'Horloge élégante et fonctionnelle pour ajouter une touche de sophistication à n\'importe quelle pièce de votre maison.',
    pictureUrl: 'https://picsum.photos/id/175/512/512',
    category: 'Mobilier',
    originalPrice: 26,
    endDate: new Date(Date.now() + 10 * DAY),
    sellerId: userCharly.id
  }))

  products.push(await Product.create({
    name: 'Embarcation en bois',
    description: 'Embarcation en bois fabriquée à la main, idéale pour les balades en mer ou sur les lacs.',
    pictureUrl: 'https://picsum.photos/id/211/512/512',
    category: 'Véhicule',
    originalPrice: 23000,
    endDate: new Date(Date.now() - 20 * DAY),
    sellerId: userCharly.id
  }))

  products.push(await Product.create({
    name: 'Théière design',
    description: 'Théière design en verre avec un filtre en acier inoxydable pour une infusion parfaite de vos thés préférés.',
    pictureUrl: 'https://picsum.photos/id/225/512/512',
    category: 'Cuisine',
    originalPrice: 299,
    endDate: new Date(Date.now() + 10 * DAY),
    sellerId: userCharly.id
  }))

  products.push(await Product.create({
    name: 'Appareil photo argentique',
    description: 'Appareil photo argentique classique, parfait pour les amateurs de photographie nostalgiques et les passionnés de la photographie vintage.',
    pictureUrl: 'https://picsum.photos/id/250/512/512',
    category: 'High-Tech',
    originalPrice: 199,
    endDate: new Date(Date.now() + 2 * DAY),
    sellerId: userCharly.id
  }))

  products.push(await Product.create({
    name: 'Kindle',
    description: 'Kindle, la liseuse électronique la plus vendue au monde, vous permettant de stocker des milliers de livres dans un seul appareil facile à transporter.',
    pictureUrl: 'https://picsum.photos/id/367/512/512',
    category: 'High-Tech',
    originalPrice: 150,
    endDate: new Date(Date.now() + 20 * DAY),
    sellerId: userAlice.id
  }))

  products.push(await Product.create({
    name: 'Grizzly',
    description: 'Authentique grizzly pour les enfants et les adultes qui aiment vivre dangereusement.',
    pictureUrl: 'https://picsum.photos/id/433/512/512',
    category: 'Jeux',
    originalPrice: 8000,
    endDate: new Date(Date.now() + 19 * DAY),
    sellerId: userBob.id
  }))

  products.push(await Product.create({
    name: 'Pair de bancs',
    description: 'Paire de bancs en bois massif, robuste et élégante, pour compléter parfaitement votre espace de vie intérieur ou extérieur.',
    pictureUrl: 'https://picsum.photos/id/553/512/512',
    category: 'Mobilier',
    originalPrice: 500,
    endDate: new Date(Date.now() - 2 * DAY),
    sellerId: userCharly.id
  }))

  products.push(await Product.create({
    name: 'Lot de tasses',
    description: 'Lot de tasses en porcelaine fine, parfait pour savourer votre café ou thé préféré tout en ajoutant une touche d\'élégance à votre table.',
    pictureUrl: 'https://picsum.photos/id/635/512/512',
    category: 'Cuisine',
    originalPrice: 50,
    endDate: new Date(Date.now() - 6 * DAY),
    sellerId: userAlice.id
  }))

  products.push(await Product.create({
    name: 'Chaussures volantes',
    description: 'Chaussures volantes haute performance, conçues pour une expérience de course inégalée, offrant un confort et un style exceptionnels.',
    pictureUrl: 'https://picsum.photos/id/817/512/512',
    category: 'Chaussure',
    originalPrice: 1000000,
    endDate: new Date(Date.now() + 60 * DAY),
    sellerId: userBob.id
  }))

  await Product.create({
    name: 'Ananas',
    description: 'Ananas frais, juteux et sucré, parfait pour une collation saine et délicieuse ou pour ajouter une touche tropicale à vos plats et cocktails.',
    pictureUrl: 'https://picsum.photos/id/824/512/512',
    category: 'Nourriture',
    originalPrice: 5,
    endDate: new Date(Date.now() + 10 * DAY),
    sellerId: userCharly.id
  })

  for (const product of products) {
    const bidders = [userAlice, userBob, userCharly].filter(user => user.id !== product.sellerId)

    if (Math.random() < 0.8) {
      let price = product.originalPrice

      let lastBuyer: null | undefined | User = null

      for (let date = new Date(Date.now() + DAY); date < product.endDate; date = new Date(date.getTime() + DAY / 4)) {
        if (Math.random() < 0.2) {
          price += Math.ceil(Math.random() * 100)

          const bidder = bidders.find(user => user.id !== lastBuyer?.id)

          lastBuyer = bidder

          await Bid.create({
            productId: product.id,
            bidderId: bidder?.id,
            price,
            date
          })
        }
      }
    }
  }

  await Bid.create({
    id: '8ccc6e79-f3c9-43e9-b47e-5be7b84d8de7',
    productId: productCasseroles.id,
    bidderId: userCharly.id,
    price: 65,
    date: new Date(Date.now() - 3 * DAY)
  })
  await Bid.create({
    productId: productCasseroles.id,
    bidderId: userBob.id,
    price: 103,
    date: new Date(Date.now() - 2 * DAY)
  })
  await Bid.create({
    productId: productCasseroles.id,
    bidderId: userCharly.id,
    price: 185,
    date: new Date(Date.now() - 0.5 * DAY)
  })
}
