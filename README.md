# BUT22 - BidBay, the eBay like

A starter project to learn JavaScript frontend and backend development

## Overview

Le projet consiste en la création d'un site web de commerce électronique simplifié, similaire à eBay, en utilisant JavaScript pour le backend avec Express pour gérer les opérations CRUD et Vue.js avec vue-router pour le frontend.

Le backend sera implémenté en utilisant Express.js, un framework Node.js largement utilisé pour la création de serveurs Web. Les opérations CRUD (Create, Read, Update, Delete) seront mises en œuvre pour permettre aux utilisateurs de créer, lire, mettre à jour et supprimer des produits de leur magasin.

Pour protéger les routes et les données sensibles, le projet utilisera JWT (JSON Web Tokens) pour l'authentification et l'autorisation. Les utilisateurs devront s'inscrire et se connecter pour accéder à leur magasin et aux fonctionnalités de gestion des produits.

Le frontend sera développé en utilisant Vue.js, un framework JavaScript pour la création d'interfaces utilisateur réactives. Vue-router sera utilisé pour gérer la navigation et les redirections de page, offrant ainsi une expérience utilisateur fluide et cohérente.

Le site Web de commerce électronique simplifié permettra aux utilisateurs de créer des magasins, de publier des produits, de les mettre à jour et de les supprimer. Les acheteurs pourront parcourir les produits des différents magasins et les acheter en utilisant un panier d'achat.

## Spécifications

### Modèle de données

    User:
        id 		    UUID de l'utilisateur 		UUIDv4
        username	Nom d'utilisateur 			chaîne de caractères, unique
        email		Adresse email 				chaîne de caractères, unique
        password	Mot de passe 				chaîne de caractères, unique
        admin		Administrateur 			    booléen

    Product:
        id		        UUID du produit 			UUIDv4
        name		    Nom du produit 		    	chaîne de caractères
        description	    Description 				chaîne de caractères
        category	    Catégorie 		    		chaîne de caractères
        originalPrice	Prix de départ 			    décimal
        pictureUrl	    Image 					    URL de la photo, optionnel
        endDate	        Date de fin de l'enchère 	date, ISO 8601
        sellerId	    Vendeur 				    ID de l'utilisateur

    Bid:
        id		    UUID de l'enchère 			    UUIDv4
        productId	UUID du produit 			    UUIDv4
        bidderId	UUID de l'utilisateur acheteur	UUIDv4
        price		Offre 					        décimal, prix en centime
        date		Date et heure de l'offre 		date, ISO 8601


Un produit est lié à un seul vendeur, mais un vendeur peut avoir plusieurs produits.
Les enchères sont liées à un seul produit et peuvent avoir plusieurs offres.

### Endpoints backend

L'authentification et l'autorisation des endpoints se base sur JSON Web Token

Payload du jeton d'authentification

```
{
    "id": "2b2bc63e-d41e-4f53-bb3c-3fc52a1de7c3",
    "username": "john_doe",
    "email": "john_doe@example.com",
    "admin": false
}
```

Endpoints de développement :

   POST /api/reset
   
   	Permet de rétablir toutes les données originelles de la base
		

Endpoints d'authentification:

    POST /api/auth/register
    
	Permet de créer un nouvel utilisateur avec les informations fournies dans le corps de la requête. Retourne également un token JWT pour l'authentification future.

	Exemple de requête:

		```
		POST /api/auth/register
		Content-Type: application/json

		{
		    "username": "john_doe",
		    "email": "john_doe@example.com",
		    "password": "1234abcd"
		}
		```

	Exemple de réponse 201 Created - Si l'utilisateur a été créé avec succès:

		```
		Status: 201 Created
		Content-Type: application/json

		{
		    "user": {
			"id": "2b2bc63e-d41e-4f53-bb3c-3fc52a1de7c3",
			"username": "john_doe",
			"email": "john_doe@example.com",
			"admin": false
		    },
		    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
		}
		```
	    .
	Exemple de réponse 400 Bad Request - Si les informations de l'utilisateur fournies sont invalides ou manquantes:
	
		```
		Status: 400 Bad Request
		Content-Type: application/json

		{
		    "error": "Invalid or missing information"
		}
		```
	
	Exemple de réponse 409 Conflict - Si un utilisateur avec la même adresse email ou nom d'utilisateur existe déjà dans la base de données:
	    	
	    	```
		Status: 409 Conflict:
		Content-Type: application/json

		{
		    "error": "E-mail already used"
		}
		```
		
    POST /api/auth/login

	Permet à un utilisateur enregistré de s'authentifier en fournissant ses informations d'identification. Si les informations d'identification sont valides, retourne un jeton d'accès JWT pour permettre à l'utilisateur de se connecter aux autres points de terminaison qui nécessitent une authentification.

	Exemple de requête:

		```
		POST /api/auth/login
		Content-Type: application/json

		{
		    "username": "john_doe",
		    "password": "1234abcd"
		}
		```

	Exemple de réponse 200 OK - Si l'utilisateur a été authentifié avec succès:

		```
		Status: 200 OK
		Content-Type: application/json

		{
		    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
		}
		```

	Exemple de réponse 401 Unauthorized - Si les informations d'identification sont invalides:


		```
		Status: 401 Unauthorized
		Content-Type: application/json

		{
		    "error": "Invalid credentials"
		}
		```

Endpoints pour les utilisateurs :

    GET /api/users/:userId
	    
	Renvoie les informations d'un utilisateur spécifié par son identifiant `userId`, dont ses listes de produits et d'offres d'enchère. L'identifiant est inclus dans l'URL de la requête. L'API retourne une réponse JSON contenant les informations de chaque produit associé à l'utilisateur.

	Exemple de requête:

		```
		GET /api/users/1f2fadb1-0d7e-47a7-9d5b-ed031d665d3e
		```
		 

	Exemple de réponse 200 OK - Si la requête a été effectuée avec succès:

		```
		Status: 200 OK
		Content-Type: application/json

		{
		    "id": "1f2fadb1-0d7e-47a7-9d5b-ed031d665d3e",
		    "username": "alice",
		    "email": "alice@example.com",
		    "admin": false,
		    "products": [
                {
                    "id": "a0f7c522-78f8-442e-a55d-642cfe566634",
                    "name": "Lot de casseroles",
                    "description": "Ensemble de casseroles de qualité supérieure pour répondre à tous vos besoins culinaires.",
                    "category": "Cuisine",
                    "originalPrice": 40,
                    "pictureUrl": "https://image.noelshack.com/fichiers/2023/12/4/1679526253-65535-51812547429-fe1cc0d832-c-512-512-nofilter.jpg",
                    "endDate": "2023-03-29T14:11:55.943Z"
                },
                ...
		    ],
		    "bids": [
                {
                    "id": "78480aee-3156-4ed0-9930-ea2ca1c8cfdf",
                    "price": 185,
                    "date": "2023-03-25T02:11:55.948Z",
                    "product": {
                        "id": "a0f7c522-78f8-442e-a55d-642cfe566634",
                        "name": "Lot de casseroles"
                    }
                },
                ...
		    ]
		}
		```
		
	Exemple de réponse 404 Not Found - Si l'utilsateur spécifié n'existe pas:

		```
		Status: 404 Not Found
		Cotent-Type: application/json

		{
		    "error": "User not found"
		}
		```


Endpoints pour les produits:

    GET /api/products
    

	Renvoie la liste de tous les produits disponibles à l'enchère.

	Exemple de requête:

		```
		GET /api/products
		```
		
	Exemple de réponse 200 OK - Si la requête a été effectuée avec succès:

		```
		Status: 200 OK
		Content-Type: application/json

		[
			{
                "id": "d1fd0f70-cf7e-4fc0-9013-59cc21d0ad90",
                "name": "Lot de dés",
                "description": "Ce lot de dés de haute qualité est parfait pour tous vos jeux de société préférés",
                "category": "Jeux",
                "originalPrice": 12,
                "pictureUrl": "https://loremflickr.com/512/512/object?lock=27",
                "endDate": "2023-03-23T17:29:12.261Z",
                "seller": {
                    "id": "3fedcc56-b1cf-446f-bfac-47c9d374bc18",
                    "username": "charly"
                },
                "bids": [
                    {
                        "id": "8ccc6e79-f3c9-43e9-b47e-5be7b84d8de7",
                        "price": 65,
                        "date": "2023-03-21T10:39:03.229Z"
                    },
                    ...
                ]
			},
			...
		]
		```
    
    GET /api/products/:productId
    

	Renvoie les informations détaillées d'un produit spécifié par son identifiant.

	Exemple de requête:

		```
		GET /api/products/d1fd0f70-cf7e-4fc0-9013-59cc21d0ad90
		```

	Exemple de réponse 200 OK - Si la requête a été effectuée avec succès:

		```
		Status: 200 OK
		Content-Type: application/json

		{
            "id": "d1fd0f70-cf7e-4fc0-9013-59cc21d0ad90",
            "name": "Lot de dés",
            "description": "Ce lot de dés de haute qualité est parfait pour tous vos jeux de société préférés.",
            "category": "Jeux",
            "originalPrice": 12,
            "pictureUrl": "https://loremflickr.com/512/512/object?lock=27",
            "endDate": "2023-03-23T17:29:12.261Z",
            "seller": {
                "id": "2f8e9450-aeab-4ece-a9bb-fb5212f28755",
                "username": "bob"
            },
            "bids": [
                {
                    "id": "ac949668-25d6-4f9b-bde1-05fe5b8c49c7",
                    "price": 67,
                    "date": "2023-03-19T11:29:12.261Z",
                    "bidder": {
                        "id": "1f2fadb1-0d7e-47a7-9d5b-ed031d665d3e",
                        "username": "alice"
                    }
                },
                ...
            ]
		}
		```
		
	Exemple de réponse 404 Not Found - Si le produit spécifié n'existe pas:

		```
		Status: 404 Not Found
		Cotent-Type: application/json

		{
		    "error": "Product not found"
		}
		```
    
    POST /api/products
   
	Permet de créer un nouveau produit.

	
	Exemple de requête:

		```
		POST /api/products
		Content-Type: application/json
		Authorization: Bearer <token>

		{
            "name": "Machine à écrire",
            "description": "Machine à écrire vintage en parfait état de fonctionnement pour une expérience d'écriture unique et authentique.",
            "pictureUrl": "https://picsum.photos/id/403/512/512",
            "category": "High-Tech",
            "originalPrice": 23,
            "endDate": "2026-01-01T09:00:00Z"
		}
		```
	
	Exemple de réponse 201 Created - Si la requête a été effectuée avec succès:

		```
		Status: 201 Created
		Content-Type: application/json

		{
            "id": "07fc9236-f9c5-41e2-89c3-4d638ac185f7",
            "name": "Machine à écrire",
            "description": "Machine à écrire vintage en parfait état de fonctionnement.",
            "category": "High-Tech",
            "originalPrice": 23,
            "pictureUrl": "https://picsum.photos/id/403/512/512",
            "endDate": "2026-01-01T09:00:00.000Z",
            "sellerId": "1f2fadb1-0d7e-47a7-9d5b-ed031d665d3e":00:00Z"
		}
		```

    Exemple de  réponse 400  Bad Request - Si la requête est invalide:
	
		```
		Status: 400 Bad Request
		Content-Type: application/json

		{
		    "error": "Invalid or missing fields",
            "details": ["name", "endDate"]
		}
		```
	
    Exemple de  réponse 401 Unauthorized - Si la requête n'est pas autorisée:
     
		```
		Status: 401 Unauthorized
		Content-Type: application/json

		{
		    "error": "Unauthorized"
		}
		```
    
    PUT /api/products/:productId
    
	Permet de mettre à jour un produit spécifié par son identifiant `productId`. L'identifiant est inclus dans l'URL de la requête. Seul l'utilisateur ayant ajouter le produit ou un administrateur peut modifier le produit.


	Exemple de requête:

		```
		PUT /api/products/a0f7c522-78f8-442e-a55d-642cfe566634
		Content-Type: application/json
		Authorization: Bearer <token>

		{
            "id": "a0f7c522-78f8-442e-a55d-642cfe566634",
            "name": "Machine à écrire",
            "description": "Machine à écrire vintage en parfait état de fonctionnement pour une expérience d'écriture unique et authentique.",
            "category": "High-Tech",
            "originalPrice": 200,
            "pictureUrl": "https://picsum.photos/id/403/512/512",
            "endDate": "2026-01-01T09:00:00.000Z",
            "sellerId": "1f2fadb1-0d7e-47a7-9d5b-ed031d665d3e"
		}
		```
	
	Exemple de réponse 200 OK - Si la requête a été effectuée avec succès:
	
		```
		Status: 200 OK
		Content-Type: application/json

		{
		    "id": "3f3fa6d4-4e4b-4bca-bc39-8e7b90a72b6a",
		    "name": "Téléviseur 4K HDR",
		    "description": "Téléviseur 4K HDR avec un son incroyable",
		    "category": "Électronique",
		    "originalPrice": 799999,
		    "pictureUrl": "https://example.com/tv2.jpg",
		    "endDate": "2023-03-09T00:00:00Z",
		    "sellerId": "2b2bc63e-d41e-4f53-bb3c-3fc52a1de7c3"
		}
		```
	
	Exemple de réponse 400 Bad Request - Si la requête est invalide:

		```
		Status: 400 Bad Request
		Content-Type: application/json

		{
		    "error": "Invalid or missing fields",
		    "details": ["name", "endDate"]
		}
		```

	Exemple de réponse 401 Unauthorized - Si la requête n'est pas autorisée:

		```
		Status: 401 Unauthorized
		Content-Type: application/json

		{
		    "error": "Unauthorized"
		}
		```

	Exemple de réponse 403 Forbidden - Si l'utilisateur n'est pas propriétaire du produit ou admin

		```
		Status: 403 Unauthorized
		Content-Type: application/json

		{
		    "error": "User not granted"
		}
		```
		
	Exemple de réponse 404 Not Found - Si le produit spécifié n'existe pas:

		```
		Status: 404 Not Found
		Cotent-Type: application/json

		{
		    "error": "Product not found"
		}
		```
		
    DELETE /api/products/:productId: supprime le produit correspondant à l'ID fourni.
    
	Permet de supprimer un produit spécifié par son identifiant `productId`. L'identifiant est inclus dans l'URL de la requête.

	Exemple de requête:

		```
		DELETE /api/products/3f3fa6d4-4e4b-4bca-bc39-8e7b90a72b6a
		Authorization: Bearer <token>
		```
	
	Exemple de réponse 204 No Content - Si la requête a été effectuée avec succès:

		```
		Status: 204 No Content
		```
	
	Exemple de réponse 401 Unauthorized - Si la requête n'est pas autorisée:
     
		```
		Status: 401 Unauthorized
		Content-Type: application/json

		{
		    "error": "Unauthorized"
		}
		```

	Exemple de réponse 403 Forbidden - Si l'utilisateur n'est pas propriétaire du produit ou admin

		```
		Status: 403 Unauthorized
		Content-Type: application/json

		{
		    "error": "User not granted"
		}
		```
		
		
	Exemple de réponse 404 Not Found - Si le produit spécifié n'existe pas:

		```
		Status: 404 Not Found
		Cotent-Type: application/json

		{
		    "error": "Product not found"
		}
		```
		
Endpoints pour les offres d'enchères :


    POST /api/products/:productId/bids
    
	Permet de créer une nouvelle enchère pour un produit spécifié par son identifiant `productId`. L'identifiant est inclus dans l'URL de la requête.


	Exemple de requête:

		```
		POST /api/products/3f3fa6d4-4e4b-4bca-bc39-8e7b90a72b6a/bids
		Content-Type: application/json
		Authorization: Bearer <token>

		{
		    "price": 90000
		}
		```
	
	Exemple de réponse 201 Created - Si la requête a été effectuée avec succès:
	
		```
		Status: 201 Created
		Content-Type: application/json

		{
            "id": "ad68d6c0-7606-4f51-86fe-843e0fac1489",
            "productId": "a0f7c522-78f8-442e-a55d-642cfe566634",
            "price": 42,
            "date": "2023-03-26T02:40:42.511Z",
            "bidderId": "1f2fadb1-0d7e-47a7-9d5b-ed031d665d3e"
		}
		```
	
	Exemple de réponse 400 Bad Request - Si la requête est invalide:

		```
		Status: 400 Bad Request
		Content-Type: application/json

		{
		    "error": "Invalid or missing fields",
		    "details": ["price"]
		}
		```
	
	Exemple de réponse 401 Unauthorized - Si la requête n'est pas autorisée:
	
		```
		Status: 401 Unauthorized
		Content-Type: application/json

		{
		    "error": "Unauthorized"
		}
		```
		
	Exemple de réponse 404 Not Found - Si le produit spécifié n'existe pas:

		```
		Status: 404 Not Found
		Cotent-Type: application/json

		{
		    "error": "Product not found"
		}
		```
		
    DELETE /api/bids/:bidId
    
	Permet de supprimer une enchère spécifique. L'identifiant de l'enchère est inclus dans l'URL de la requête. Seul l'utilisateur ayant fait l'enchère ou un administrateur peut supprimer l'enchère.
	 
	Exemple de requête:

		```
		DELETE /api/bids/4c4cf5aa-0ce7-4f64-8d02-8b557a6b7112
		Authorization: Bearer <token>
		```
		
	Exemple de réponse 204 No Content - Si la requête a été effectuée avec succès:

		```
		Status: 204 No Content
		```
		
	Exemple de réponse 401 Unauthorized - Si la requête n'est pas autorisée:
	
		```
		Status: 401 Unauthorized
		Content-Type: application/json

		{
		    "error": "Unauthorized"
		}
		```
	
	Exemple de réponse 404 Not Found - Si l'enchère spécifiée n'existe pas:

		```
		Status: 404 Not Found
		Cotent-Type: application/json

		{
		    "error": "Bid not found"
		}
		```

### Pages frontend

Liste des produits `/`
- Voir une liste de produit (nom (lien vers `/products/:productId`), description, photo, vendeur (lien vers `/users/:userId`), prix actuel)
- Filtrer une liste de produit (par nom)
- Trier une liste de produit (par nom, par prix)
- Accéder au produit (`/products/:productId`)
  
Page de connexion `/login`
- Se connecter pour obtenir un JWT

Page d'inscription `/register`
- Créer un compte (et être connecté directement après la création du compte)

Page d'ajout d'un produit `/products/add`
- Ajouter un produit, être redirigé vers la page produit après création


Page d'un produit `/products/:productId`
- Voir les informations détaillées d'un produit spécifique (nom, description, photo, prix de départ, date de début et de fin de l'enchère, vendeur (lien vers `/users/:userId`))
- Afficher un compte à rebour du temps (heure, minute, secondes) restant avant la fin de la vente
- Lister les offres sur le produit
- Proposer une offre, si la vente a commencé et n'est pas terminée (l'utilisateur doit être authentifié)
- Suprimer un produit (l'utilisateur doit être authentifié et avoir ajouté le produit, ou être administrateur)
- Suprimer une offre (l'utilisateur doit être authentifié et avoir proposé l'offre, ou être administrateur)

Page de modification un produit `/products/:productId/edit`
- Editer un produit, être redirigé vers la page produit après édition

Page des produits et enchères d'un utilisateur `/users/:userId`
- Voir la liste des produits mis en vente par un utilisateur  (nom (lien vers `/product/:productId`), description, photo, prix de départ, nombre d'offres)
- Voir la liste des produits sur lequel un utilisateur a fait une offre (nom du produit (lien vers `/product/:productId`), prix de l'offre, date et heure)

Page des produits et enchères d'un utilisateur `/users/me`
- Voir la liste des produits mis en vente par l'utilisateur authentifié  (nom (lien vers `/product/:productId`), description, photo, prix de départ, nombre d'offres)
- Voir la liste des produits sur lequel l'utilisateur authentifié a fait une offre (nom du produit (lien vers `/product/:productId`), prix de l'offre, date et heure)

Menu de navigation
- Se déconnecter

## Get started

### Javascript vs Typescript
La version typescript est disponible dans la branche `main-ts`.
Si vous l'utilisez, il faudra la merge dans la branche `main`.

### Lancer le frontend

```
cd frontend/
npm install
npm run dev
# Your frontend server is on localhost:5173
```

Si jamais votre serveur n'est pas accessible depuis Cypress, vous pouvez tester cette commande
```
npm run dev:workaround
```

### Lancer le backend

```
cd backend/
npm install
npm start
# Your backend server is on localhost:3000
```

### Lancer les tests

```
cd frontend/
npm run test
```

### Lancer le reporting des tests
```
cd frontend/
npm run test-report
```
Les fichiers générés doivent être ajoutés dans votre repo

### Données

La base de données est déjà populée avec des données pour vous permettre de rentrer rapidement dans le sujet.

Voilà les logins des comptes utilisateurs pour vous connecter.

```
alice@example.com : azerty

bob@example.com : azerty

charly@example.com : azerty

admin@admin.org : admin
```

### Postman

Postman est un utilitaire de conception  et de documentation pour d'API.

Il permet de créer et d'envoyer des requêtes HTTP, de visualiser les réponses et d'automatiser les tests de l'API.

[Télécharger Postman](https://www.postman.com/downloads/)

Pour vous aider à développer le backend, une collection Postman est disponible dans le dossier backend

### Démo

Si vous avez des doutes sur le fonctionnel attendu dans la roadmap ci-dessous, vous pouvez consulter la démo disponible 

[https://bidbay.glitch.me/](https://bidbay.glitch.me/)

### Roadmap

Le but principal du projet est d'implémenter un maximum de fonctionnalité afin de faire passer les tests Cypress au vert (c'est sur cette base qu'est établie la notation).

Voilà une suggestion de roadmap pour développer ce projet.

- Remplir vos noms, prénoms et numéro d'étudiants dans le fichier authors.js

- Implémenter l'API `GET /api/products`
	
- Implémenter la page racine qui liste les produits `/`
    > Lister les produits (nom (lien vers `/products/:productId`), description, photo, vendeur (lien vers `/users/:userId`), prix actuel) depuis `GET /api/products`
    > Filtrer une liste de produit (par nom)
    > Trier une liste de produit (par nom, par prix)

- Implémenter l'API `POST /api/products/`

- Implémenter la page d'ajout d'un produit `/products/add`
    > Rediriger sur la page de login si non connecté
    > Permettre de remplir le nom, description, photo, prix de départ, date de début et fin
    > Enregistrer via `POST /api/products/` 
    > Gérer message d'erreur
    > Rediriger sur la page du produit après ajout

- Implémenter l'API `GET /api/products/:productId`


- Implémenter l'affichage des infos d'un produit spécifiques `/products/:productId`
	> Afficher les informations détaillées d'un produit spécifique (nom, description, photo, prix de départ, date de début et de fin de l'enchère, vendeur (lien vers `/users/:userId`)) via `GET /api/products/:productId`
	> Afficher un compte à rebour du temps (heure, minute, secondes) restant avant le début ou la fin de la vente, ou "Vente terminée", selon les cas
	> Conditionner l'accès au bouton d'édition, l'utilisateur doit être authentifié et avoir ajouté le produit, ou être administrateur
	> Conditionner l'accès au bouton de suppression, l'utilisateur doit être authentifié et avoir ajouté le produit, ou être administrateur
	
- Implémenter l'API `DELETE /api/products/:productId`
	
- Implémenter la suppression d'un produit depuis la page d'un produit `/products/:productId`
	> Pour avoir accès à la page de suppression, l'utilisateur doit être authentifié et avoir ajouté le produit, ou être administrateur
	> Permettre de supprimer un produit via `DELETE /api/products/:productId`
	> Afficher un message en cas d'erreur 404
	> L'utilisateur est redirigé sur le listing des produits après suppression
	
	
- Implémenter la page de mise à jour des infos d'un produit `/products/:productId/edit`
	> Pour avoir accès à la page d'édition, l'utilisateur doit être authentifié et avoir ajouté le produit, ou être administrateur
	> Via `PUT /api/products/:productId`	
	> Afficher un message en cas d'erreur 404
	> L'utilisateur est redirigé sur la page du produit 
	

- Implémenter l'ajout d'une offre d'enchère sur la page d'un produit `/products/:productId`
	> Pour avoir accès à la proposition d'offre, l'utilisateur ne doit pas être celui qui a ajouté le produit
	> Afficher un message d'avertissement si l'offre proposée n'est pas plus haute que la plus haute offre courante
	> Via `POST /api/products/:productId/bids`
	> Gérer les cas d'erreur
	
- Implémenter la suppression d'un offre d'enchère
	> Pour avoir accès à la suppression d'une offre, l'utilisateur doit être authentifié et avoir ajouté l'offre, ou être administrateur
	> Via `DELETE /api/bids/:bidId`
	> Gérer les cas d'erreur

- Implémenter la page de récapitualtif des produits et enchères d'un utilisateur `/users/:userId`
	> Via `GET /api/users/:userId/products` et `GET /api/users/:userId/bids`
	> Voir la liste des produits mis en vente par l'utilisateur  (nom (lien vers `/product/:productId`), description, photo, prix actuel, nombre d'offres)
	> Voir la liste des produits sur lequel l'utilisateur a fait une offre (nom du produit (lien vers `/product/:productId`), offre la plus haute, date et heure, status (gagnante ou perdante))

- Modifier la page `/users/:userId` pour gérer `/users/me` affichant les produits et offres d'enchères de l'utilisateur authentifié
	> L'utilisateur doit être authentifié, sinon il doit être redirigé vers la page de connexion

