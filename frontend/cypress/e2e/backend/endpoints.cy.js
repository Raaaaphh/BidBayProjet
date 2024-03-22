import { IOS8601, UUIDv4 } from "../common/pattern";
import {
  adminToken,
  aliceId,
  aliceToken,
  bobToken,
  charlyId,
  charlyToken,
} from "../common/tokens";
import { buildProduct, createProduct, getProducts } from "../common/orm";

beforeEach(() => {
  cy.request("http://localhost:3000/api/dev/reset");
});

describe("GET /api/products", () => {
  const endpoint = "http://localhost:3000/api/products";

  it("returns 200 - success", () => {
    cy.request(endpoint).then((response) => {
      expect(response.status).to.be.eq(200);
      expect(response.headers["content-type"]).to.contains("application/json");

      for (let product of response.body) {
        expect(product.id).to.be.a("string");
        expect(product.id).to.be.match(UUIDv4);
        expect(product.name).to.be.a("string");
        expect(product.description).to.be.a("string");
        expect(product.category).to.be.a("string");
        expect(product.originalPrice).to.be.a("number");
        expect(product.pictureUrl).to.be.a("string");
        expect(product.endDate).to.be.a("string");
        expect(product.endDate).to.match(IOS8601);

        expect(product.seller.id).to.be.a("string");
        expect(product.seller.username).to.be.a("string");

        for (let bid of product.bids) {
          expect(bid.id).to.be.a("string");
          expect(bid.id).to.match(UUIDv4);
          expect(bid.price).to.be.a("number");
          expect(bid.date).to.be.a("string");
          expect(bid.date).to.match(IOS8601);
        }

        const fixtureProduct = response.body.find((item) => {
          return item.id === "a0f7c522-78f8-442e-a55d-642cfe566634";
        });

        expect(fixtureProduct.id).to.be.eq(
          "a0f7c522-78f8-442e-a55d-642cfe566634"
        );
        expect(fixtureProduct.name).to.be.eq("Lot de casseroles");
        expect(fixtureProduct.description).to.be.eq(
          "Ensemble de casseroles de qualité supérieure pour répondre à tous vos besoins culinaires."
        );
        expect(fixtureProduct.category).to.be.eq("Cuisine");
        expect(fixtureProduct.originalPrice).to.be.eq(40);
        expect(fixtureProduct.pictureUrl).to.be.eq(
          "https://image.noelshack.com/fichiers/2023/12/4/1679526253-65535-51812547429-fe1cc0d832-c-512-512-nofilter.jpg"
        );
        expect(fixtureProduct.seller.id).to.be.eq(aliceId);
        expect(fixtureProduct.seller.username).to.be.eq("alice");

        expect(fixtureProduct.bids.some((bid) => bid.price === 65)).to.be.true;
      }
    });
  });
});

describe("POST /api/products", () => {
  it("returns 401 - not authorized", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/products",
      headers: {
        Authorization: `Bearer BAD_TOKEN`,
      },
      body: {
        name: "New Product",
        description: "This is a new product",
        category: "Electronics",
        originalPrice: 99,
        pictureUrl: "https://example.com/product.jpg",
        endDate: "2023-04-01T00:00:00.000Z",
      },
      failOnStatusCode: false,
    })
      .its("status")
      .should("equal", 401);
  });

  it("returns 201 - created", () => {
    // Create a new product
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/products",
      headers: {
        Authorization: `Bearer ${aliceToken}`,
      },
      body: {
        name: "New Product",
        description: "This is a new product",
        category: "Electronics",
        originalPrice: 99,
        pictureUrl: "https://example.com/product.jpg",
        endDate: "2023-04-01T00:00:00.000Z",
      },
    }).then((response) => {
      // Assert that the response is as expected
      expect(response.status).to.eq(201);
      expect(response.body.id).to.be.match(UUIDv4);
      expect(response.body.name).to.eq("New Product");
      expect(response.body.description).to.eq("This is a new product");
      expect(response.body.category).to.eq("Electronics");
      expect(response.body.originalPrice).to.eq(99);
      expect(response.body.pictureUrl).to.eq("https://example.com/product.jpg");
      expect(response.body.endDate).to.eq("2023-04-01T00:00:00.000Z");
      expect(response.body.sellerId).to.eq(aliceId);
    });
  });

  it("returns 400 - missing or invalid fields", () => {
    // Create a new product

    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/products",
      headers: {
        Authorization: `Bearer ${aliceToken}`,
      },
      body: {
        // Missing name: "Machine à écrire",
        description:
          "Machine à écrire vintage en parfait état de fonctionnement pour une expérience d'écriture unique et authentique.",
        pictureUrl: "https://picsum.photos/id/403/512/512",
        category: "High-Tech",
        originalPrice: 200,
        endDate: "2026-01-01T09:00:00Z",
      },
      failOnStatusCode: false,
    }).then((req) => {
      expect(req.status).to.be.eq(400);
      expect(req.body.error).to.be.eq("Invalid or missing fields");
      expect(req.body.details).to.exist;
    });
  });

  it("check mutation - object created in database", () => {
    // Create a new product

    getProducts().then(({ products: productsBeforeCreation }) => {
      createProduct().then(({ product }) => {
        getProducts().then(({ products: productsAfterCreation }) => {
          const newProducts = productsAfterCreation.filter((product) =>
            productsBeforeCreation.every(
              (existingProduct) => existingProduct.id !== product.id
            )
          );

          expect(newProducts.length).to.be.eq(1);

          const newProduct = newProducts[0];

          expect(newProduct.id).to.be.match(UUIDv4);
          expect(newProduct.name).to.eq(name);
          expect(newProduct.description).to.eq(product.description);
          expect(newProduct.category).to.eq(product.category);
          expect(newProduct.originalPrice).to.eq(product.originalPrice);
          expect(newProduct.pictureUrl).to.eq(product.pictureUrl);
          expect(newProduct.endDate).to.eq(product.endDate);
          expect(newProduct.seller.id).to.eq(aliceId);
          expect(newProduct.seller.username).to.eq("alice");
        });
      });
    });
  });
});

describe("GET /api/products/:productId", () => {
  const endpoint =
    "http://localhost:3000/api/products/a0f7c522-78f8-442e-a55d-642cfe566634";

  it("returns 404 - not found", () => {
    cy.request({
      url: "http://localhost:3000/api/products/not-existing-id",
      failOnStatusCode: false,
    })
      .its("status")
      .should("equal", 404);
  });

  it("returns 200 - success", () => {
    cy.request(endpoint).then((response) => {
      expect(response.status).to.be.eq(200);
      expect(response.headers["content-type"]).to.includes("application/json");

      const product = response.body;

      expect(product.id).to.be.eq("a0f7c522-78f8-442e-a55d-642cfe566634");
      expect(product.name).to.be.eq("Lot de casseroles");
      expect(product.description).to.be.eq(
        "Ensemble de casseroles de qualité supérieure pour répondre à tous vos besoins culinaires."
      );
      expect(product.category).to.be.eq("Cuisine");
      expect(product.originalPrice).to.be.eq(40);
      expect(product.pictureUrl).to.be.eq(
        "https://image.noelshack.com/fichiers/2023/12/4/1679526253-65535-51812547429-fe1cc0d832-c-512-512-nofilter.jpg"
      );
      expect(product.seller.id).to.be.eq(aliceId);
      expect(product.seller.username).to.be.eq("alice");

      const bid = response.body.bids.find((bid) => bid.price === 65);
      expect(bid.id).to.be.eq("8ccc6e79-f3c9-43e9-b47e-5be7b84d8de7");
      expect(bid.bidder.id).to.be.eq(charlyId);
      expect(bid.bidder.username).to.be.eq("charly");
    });
  });
});

describe("PUT /api/products/:productId", () => {
  const endpoint =
    "http://localhost:3000/api/products/a0f7c522-78f8-442e-a55d-642cfe566634";

  it("returns 401 - not authorized", () => {
    cy.request({
      method: "PUT",
      url: endpoint,
      headers: {
        Authorization: `Bearer BAD_TOKEN`,
      },
      body: {
        name: "Machine à écrire",
        description:
          "Machine à écrire vintage en parfait état de fonctionnement pour une expérience d'écriture unique et authentique.",
        pictureUrl: "https://picsum.photos/id/403/512/512",
        category: "High-Tech",
        originalPrice: 200,
        endDate: "2026-01-01T09:00:00Z",
      },
      failOnStatusCode: false,
    })
      .its("status")
      .should("equal", 401);
  });

  it("returns 200 - success, when owner edit", () => {
    cy.request({
      url: endpoint,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${aliceToken}`,
      },
      body: {
        name: "Machine à écrire",
        description:
          "Machine à écrire vintage en parfait état de fonctionnement pour une expérience d'écriture unique et authentique.",
        pictureUrl: "https://picsum.photos/id/403/512/512",
        category: "High-Tech",
        originalPrice: 200,
        endDate: "2026-01-01T09:00:00Z",
      },
    })
      .its("status")
      .should("equal", 200);
  });

  it("returns 403 - forbidden, when non owner edit", () => {
    cy.request({
      url: endpoint,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${bobToken}`,
      },
      body: {
        name: "Machine à écrire",
        description:
          "Machine à écrire vintage en parfait état de fonctionnement pour une expérience d'écriture unique et authentique.",
        pictureUrl: "https://picsum.photos/id/403/512/512",
        category: "High-Tech",
        originalPrice: 200,
        endDate: "2026-01-01T09:00:00Z",
      },
      failOnStatusCode: false,
    })
      .its("status")
      .should("equal", 403);
  });

  it("returns 200 - success, when admin edit", () => {
    cy.request({
      url: endpoint,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      body: {
        name: "Machine à écrire",
        description:
          "Machine à écrire vintage en parfait état de fonctionnement pour une expérience d'écriture unique et authentique.",
        pictureUrl: "https://picsum.photos/id/403/512/512",
        category: "High-Tech",
        originalPrice: 200,
        endDate: "2026-01-01T09:00:00Z",
      },
    })
      .its("status")
      .should("equal", 200);
  });

  it("returns 404 - not found", () => {
    cy.request({
      url: "http://localhost:3000/api/products/not-existing-id",
      method: "PUT",
      headers: {
        Authorization: `Bearer ${aliceToken}`,
      },
      body: {
        name: "Machine à écrire",
        description:
          "Machine à écrire vintage en parfait état de fonctionnement pour une expérience d'écriture unique et authentique.",
        pictureUrl: "https://picsum.photos/id/403/512/512",
        category: "High-Tech",
        originalPrice: 200,
        endDate: "2026-01-01T09:00:00Z",
      },
      failOnStatusCode: false,
    })
      .its("status")
      .should("equal", 404);
  });

  it("check mutation - object updated in database", () => {
    const newProductData = buildProduct();

    cy.request({
      url: endpoint,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${aliceToken}`,
      },
      body: {
        name: newProductData.name,
        description: newProductData.description,
        pictureUrl: newProductData.pictureUrl,
        category: newProductData.category,
        originalPrice: newProductData.originalPrice,
        endDate: newProductData.endDate.toISOString(),
      },
    }).then(() => {
      cy.request(endpoint).then((response) => {
        const product = response.body;

        expect(response.status).to.be.eq(200);

        expect(product.id).to.be.eq("a0f7c522-78f8-442e-a55d-642cfe566634");
        expect(product.name).to.be.eq(newProductData.name);
        expect(product.description).to.be.eq(newProductData.description);
        expect(product.category).to.be.eq(newProductData.category);
        expect(product.originalPrice).to.be.eq(newProductData.originalPrice);
        expect(product.pictureUrl).to.be.eq(newProductData.pictureUrl);
        expect(product.endDate).to.be.eq(newProductData.endDate.toISOString());
        expect(product.seller.id).to.be.eq(aliceId);
        expect(product.seller.username).to.be.eq("alice");
      });
    });
  });
});

describe("DELETE /api/products/:productId", () => {
  const endpoint =
    "http://localhost:3000/api/products/a0f7c522-78f8-442e-a55d-642cfe566634";

  it("returns 401 - not authorized", () => {
    cy.request({
      method: "DELETE",
      url: endpoint,
      headers: {
        Authorization: `Bearer BAD_TOKEN`,
      },
      failOnStatusCode: false,
    })
      .its("status")
      .should("equal", 401);
  });

  it("returns 204 - success, when owner edit", () => {
    cy.request({
      url: endpoint,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${aliceToken}`,
      },
    })
      .its("status")
      .should("equal", 204);
  });

  it("returns 403 - forbidden, when non owner edit", () => {
    cy.request({
      url: endpoint,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${bobToken}`,
      },
      failOnStatusCode: false,
    })
      .its("status")
      .should("equal", 403);
  });

  it("returns 204 - success, when admin edit", () => {
    cy.request({
      url: endpoint,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })
      .its("status")
      .should("equal", 204);
  });

  it("returns 404 - not found", () => {
    cy.request({
      url: "http://localhost:3000/api/products/not-existing-id",
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${aliceToken}`,
      },
      failOnStatusCode: false,
    })
      .its("status")
      .should("equal", 404);
  });

  it("check mutation - object deleted in database", () => {
    cy.request({
      url: endpoint,
      method: "GET",
      headers: {
        Authorization: `Bearer ${aliceToken}`,
      },
    }).then((response) => {
      expect(response.status).to.be.eq(200);

      cy.request({
        url: endpoint,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${aliceToken}`,
        },
      }).then((response) => {
        expect(response.status).to.be.eq(204);

        cy.request({
          url: endpoint,
          method: "GET",
          headers: {
            Authorization: `Bearer ${aliceToken}`,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.be.eq(404);
        });
      });
    });
  });
});

describe("POST /api/products/:productId/bids", () => {
  it("returns 401 - not authorized", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/products/a0f7c522-78f8-442e-a55d-642cfe566634/bids",
      headers: {
        Authorization: `Bearer BAD_TOKEN`,
      },
      body: {
        name: "New Product",
        description: "This is a new product",
        category: "Electronics",
        originalPrice: 99,
        pictureUrl: "https://example.com/product.jpg",
        endDate: "2023-04-01T00:00:00.000Z",
      },
      failOnStatusCode: false,
    })
      .its("status")
      .should("equal", 401);
  });

  it("returns 201 - created", () => {
    // Create a new product
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/products/a0f7c522-78f8-442e-a55d-642cfe566634/bids",
      headers: {
        Authorization: `Bearer ${aliceToken}`,
      },
      body: {
        price: 42,
      },
    }).then((response) => {
      // Assert that the response is as expected
      expect(response.status).to.eq(201);
      expect(response.body.id).to.be.match(UUIDv4);
      expect(response.body.productId).to.be.match(UUIDv4);
      expect(response.body.price).to.be.a("number");
      expect(response.body.date).to.match(IOS8601);
      expect(response.body.bidderId).to.match(UUIDv4);
    });
  });

  it("returns 400 - missing or invalid fields", () => {
    // Create a new product

    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/products/a0f7c522-78f8-442e-a55d-642cfe566634/bids",
      headers: {
        Authorization: `Bearer ${aliceToken}`,
      },
      body: {
        // price: 42, missing
      },
      failOnStatusCode: false,
    }).then((req) => {
      expect(req.status).to.be.eq(400);
      expect(req.body.error).to.be.eq("Invalid or missing fields");
      expect(req.body.details).to.exist;
    });
  });

  it("check mutation - object created in database", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/products/a0f7c522-78f8-442e-a55d-642cfe566634/bids",
      headers: {
        Authorization: `Bearer ${aliceToken}`,
      },
      body: {
        price: 42,
      },
    }).then((response) => {
      expect(response.status).to.be.eq(201);

      const newBid = response.body;

      cy.request(
        "http://localhost:3000/api/products/a0f7c522-78f8-442e-a55d-642cfe566634"
      ).then((response) => {
        const product = response.body;

        expect(product.bids.some((bid) => bid.id === newBid.id)).to.be.true;
      });
    });
  });
});

describe("DELETE /bids/:bidId", () => {
  const endpoint =
    "http://localhost:3000/api/bids/8ccc6e79-f3c9-43e9-b47e-5be7b84d8de7";

  it("returns 401 - not authorized", () => {
    cy.request({
      method: "DELETE",
      url: endpoint,
      headers: {
        Authorization: `Bearer BAD_TOKEN`,
      },
      failOnStatusCode: false,
    })
      .its("status")
      .should("equal", 401);
  });

  it("returns 204 - success, when owner edit", () => {
    cy.request({
      url: endpoint,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${charlyToken}`,
      },
    })
      .its("status")
      .should("equal", 204);
  });

  it("returns 403 - forbidden, when non owner edit", () => {
    cy.request({
      url: endpoint,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${bobToken}`,
      },
      failOnStatusCode: false,
    })
      .its("status")
      .should("equal", 403);
  });

  it("returns 204 - success, when admin edit", () => {
    cy.request({
      url: endpoint,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })
      .its("status")
      .should("equal", 204);
  });

  it("returns 404 - not found", () => {
    cy.request({
      url: "http://localhost:3000/api/products/not-existing-id",
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${aliceToken}`,
      },
      failOnStatusCode: false,
    })
      .its("status")
      .should("equal", 404);
  });

  it("check mutation - object deleted in database", () => {
    cy.request({
      url: "http://localhost:3000/api/products/a0f7c522-78f8-442e-a55d-642cfe566634",
      method: "GET",
      headers: {
        Authorization: `Bearer ${aliceToken}`,
      },
    }).then((response) => {
      const product = response.body;
      expect(
        product.bids.some(
          (bid) => bid.id === "8ccc6e79-f3c9-43e9-b47e-5be7b84d8de7"
        )
      ).to.be.true;

      cy.request({
        url: endpoint,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${charlyToken}`,
        },
      }).then((response) => {
        expect(response.status).to.be.eq(204);

        cy.request({
          url: "http://localhost:3000/api/products/a0f7c522-78f8-442e-a55d-642cfe566634",
          method: "GET",
          headers: {
            Authorization: `Bearer ${aliceToken}`,
          },
          failOnStatusCode: false,
        }).then((response) => {
          const product = response.body;
          expect(
            product.bids.some(
              (bid) => bid.id === "8ccc6e79-f3c9-43e9-b47e-5be7b84d8de7"
            )
          ).to.be.false;
        });
      });
    });
  });
});

describe("GET /api/users/:userId", () => {
  it("returns 404 - not found", () => {
    cy.request({
      url: "http://localhost:3000/api/users/not-existing-id",
      failOnStatusCode: false,
    })
      .its("status")
      .should("equal", 404);
  });

  it("returns 200 - success", () => {
    cy.request(
      "http://localhost:3000/api/users/1f2fadb1-0d7e-47a7-9d5b-ed031d665d3e"
    ).then((response) => {
      expect(response.status).to.be.eq(200);
      expect(response.headers["content-type"]).to.contains("application/json");

      const user = response.body;

      expect(user.id).to.eq("1f2fadb1-0d7e-47a7-9d5b-ed031d665d3e");
      expect(user.username).to.be.eq("alice");
      expect(user.admin).to.be.false;

      for (let product of user.products) {
        expect(product.id).to.be.a("string");
        expect(product.id).to.match(UUIDv4);
        expect(product.description).to.be.a("string");
        expect(product.category).to.be.a("string");
        expect(product.originalPrice).to.be.a("number");
        expect(product.pictureUrl).to.be.a("string");
        expect(product.endDate).to.be.a("string");
        expect(product.endDate).to.match(IOS8601);
      }

      for (let bid of user.bids) {
        expect(bid.id).to.be.a("string");
        expect(bid.id).to.match(UUIDv4);
        expect(bid.price).to.be.a("number");
        expect(bid.date).to.be.a("string");
        expect(bid.date).to.match(IOS8601);
        expect(bid.product.id).to.a("string");
        expect(bid.product.id).to.match(UUIDv4);
        expect(bid.product.name).to.a("string");
      }
    });
  });
});
