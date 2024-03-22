import {
  adminId,
  adminToken,
  aliceId,
  aliceToken,
  bobToken,
} from "../common/tokens";

import { createBid, createProduct } from "../common/orm";

beforeEach(() => {
  cy.request("http://localhost:3000/api/dev/reset");
});

describe("Page /users/:userId", () => {
  it("display products", () => {
    // Note : Test le scénario de récupération et d'affichage des produits

    createProduct().then(({ product }) => {
      cy.visit(`http://localhost:5173/users/${aliceId}`);

      cy.get("[data-test-product]").should("have.length", 8);

      cy.get("[data-test-product]")
        .last()
        .find("[data-test-product-name]")
        .should("have.text", product.name)
        .invoke("attr", "href")
        .should("contain", product.id);

      cy.get("[data-test-product]")
        .last()
        .find("[data-test-product-description]")
        .should("have.text", product.description);

      cy.get("[data-test-product]")
        .last()
        .find("[data-test-product-price]")
        .should("contain.text", product.originalPrice + " €");

      cy.get("[data-test-product]")
        .last()
        .find("[data-test-product-picture]")
        .invoke("attr", "src")
        .should("eq", product.pictureUrl);
    });
  });

  it("display bids", () => {
    // Note : Test le scénario de récupération et d'affichage des offres

    createProduct("futur", bobToken).then(({ product }) => {
      createBid(product.id, product.originalPrice, aliceToken).then(
        ({ bid }) => {
          cy.visit(`http://localhost:5173/users/${aliceId}`);

          cy.get("[data-test-bid]").should("exist");

          cy.get(`[data-test-bid-product][href$="${product.id}"]`)
            .should("exist")
            .first()
            .closest("[data-test-bid]")
            .then((el) => {
              cy.wrap(el)
                .find("[data-test-bid-product]")
                .should("have.text", product.name);

              cy.wrap(el)
                .find("[data-test-bid-price]")
                .should("have.text", bid.price + " €");

              cy.wrap(el)
                .find("[data-test-bid-date]")
                .should("contain.text", new Date().getDate())
                .should("contain.text", new Date().getMonth() + 1)
                .should("contain.text", new Date().getFullYear());
            });
        }
      );
    });
  });

  it("no admin badge", () => {
    // Note : Vérifie qu'un utilisateur a un badge admin si et seulement si il est admin

    cy.visit(`http://localhost:5173/users/${aliceId}`);

    cy.get("[data-test-admin]").should("not.exist");

    cy.visit(`http://localhost:5173/users/${adminId}`);

    cy.get("[data-test-admin]").should("exist");
  });

  it("loading", () => {
    // Note : Vérifie la présence d'un spinner au chargement

    cy.intercept(`http://localhost:3000/api/users/${aliceId}`, {
      delay: 10000,
    });

    cy.visit(`http://localhost:5173/users/${aliceId}`);

    cy.get("[data-test-loading]").should("exist");
    cy.get("[data-test-view]").should("not.exist");
    cy.get("[data-test-error]").should("not.exist");
  });

  it("error", () => {
    // Note : Vérifie la présence d'une erreur en cas d'échec de chargement

    cy.intercept(`http://localhost:3000/api/users/${aliceId}`, {
      statusCode: 500,
    });

    cy.visit(`http://localhost:5173/users/${aliceId}`);

    cy.get("[data-test-error]").should("exist");
    cy.get("[data-test-loading]").should("not.exist");
    cy.get("[data-test-view]").should("not.exist");
  });

  it("ready", () => {
    // Note : Vérifie la présence du contenu quand tout s'est bien chargé

    cy.visit(`http://localhost:5173/users/${aliceId}`);

    cy.get("[data-test-error]").should("not.exist");
    cy.get("[data-test-loading]").should("not.exist");
    cy.get("[data-test-view]").should("exist");
  });
});

describe("Page /users/me", () => {
  it("me as alice", () => {
    // Note : Vérifie que le contenu de la page est bien celui de l'utilisateur courant

    cy.visit(`http://localhost:5173/users/me`, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem("token", aliceToken);
      },
    });

    cy.get("[data-test-username]").should("contain.text", "alice");
    cy.get("[data-test-product]").should("have.length", 7);
  });

  it("me as bob", () => {
    // Note : Vérifie que le contenu de la page est bien celui de l'utilisateur courant

    cy.visit(`http://localhost:5173/users/me`, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem("token", bobToken);
      },
    });

    cy.get("[data-test-username]").should("contain.text", "bob");
    cy.get("[data-test-product]").should("have.length", 3);
  });

  it("me as admin", () => {
    // Note : Vérifie que le contenu de la page est bien celui de l'utilisateur courant

    cy.visit(`http://localhost:5173/users/me`, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem("token", adminToken);
      },
    });

    cy.get("[data-test-username]").should("contain.text", "admin");
  });
});
