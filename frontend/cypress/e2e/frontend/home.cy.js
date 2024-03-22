import { aliceId, bobToken } from "../common/tokens";
import { createBid, createProduct } from "../common/orm";

beforeEach(() => {
  cy.request("http://localhost:3000/api/dev/reset");
});

const url = "http://localhost:5173/";

describe("Page /", () => {
  it("fetch products", () => {
    // Note : Test le scénario de récupération et d'affichage de tous les produits

    cy.visit(url);

    cy.get("[data-test-product]").should("have.length", 17);
  });

  it("display product with past end date and last bid price", () => {
    // Note : Vérifie que tous les éléments d'un produit sont bien affichés
    // Note : Si la date de fin est passée, afficher "Terminé"
    // Note : Si une offre existe pour le produit, afficher "Prix actuel : <montant de l'offre>"

    createProduct("past").then(({ product }) => {
      createBid(product.id, product.originalPrice, bobToken)
        .then(({ bid }) => {
          cy.visit(url);

          cy.get("[data-test-product]").should("have.length", 18);

          cy.get(`[data-test-product-name]:contains("${name}")`)
            .should("exist")
            .first()
            .closest("[data-test-product]")
            .then((el) => {
              cy.wrap(el)
                .find("[data-test-product-name]")
                .invoke("attr", "href")
                .should("include", product.id);

              cy.wrap(el)
                .find("[data-test-product-description]")
                .should("have.text", product.description);

              cy.wrap(el)
                .find("[data-test-product-seller]")
                .should("have.text", "alice")
                .invoke("attr", "href")
                .should("include", aliceId);

              cy.wrap(el)
                .find("[data-test-product-date]")
                .should("contain.text", "Terminé");

              cy.wrap(el)
                .find("[data-test-product-price]")
                .should("contain.text", "Prix actuel")
                .should("contain.text", " " + bid.price + " €");
            });
        })
        .catch(() => {
          expect.fail("Bid creation fail");
        });
    });
  });

  it("display product with futur end date and original price (cause there not yet any bid)", () => {
    // Note : Vérifie que tous les éléments d'un produit sont bien affichés
    // Note : Si la date de fin n'est pas passée, afficher "En cours jusqu'au <date de fin>"
    // Note : Si aucune une offre n'existe pour le produit, afficher "Prix de départ : <prix de départ>"

    createProduct().then(({ product }) => {
      cy.visit(url);

      cy.get("[data-test-product]").should("have.length", 18);

      cy.get(`[data-test-product-name]:contains("${name}")`)
        .should("exist")
        .first()
        .closest("[data-test-product]")
        .then((el) => {
          cy.wrap(el)
            .find("[data-test-product-description]")
            .should("have.text", product.description);

          cy.wrap(el)
            .find("[data-test-product-seller]")
            .should("have.text", "alice")
            .invoke("attr", "href")
            .should("include", aliceId);

          cy.wrap(el)
            .find("[data-test-product-date]")
            .should("contain.text", "En cours jusqu'au");

          cy.wrap(el)
            .find("[data-test-product-price]")
            .should("contain.text", "Prix de départ")
            .should("contain.text", " " + product.originalPrice + " €");
        });
    });
  });

  it("filter by name", () => {
    // Note : Vérifie le filtrage par nom, insensible à la casse

    cy.visit(url);

    cy.get("[data-test-product]").should("have.length", 17);

    cy.get("[data-test-filter").type("Lot");
    cy.get("[data-test-product]").should("have.length", 3);

    cy.get("[data-test-filter").type("{selectAll}{del}");
    cy.get("[data-test-filter").type("lot");
    cy.get("[data-test-product]").should("have.length", 3);

    cy.get("[data-test-filter").type("{selectAll}{del}");
    cy.get("[data-test-filter").type("lot de tasses");
    cy.get("[data-test-product]").should("have.length", 1);
  });

  it("sort by name", () => {
    // Note : Vérifie le tri par nom, alphabétique de A à Z

    cy.visit(url);

    cy.get("[data-test-sorter]").should("contain.text", "Trier par nom");

    cy.get("[data-test-product]")
      .first()
      .find("[data-test-product-name]")
      .should("have.text", "Ampli de guitare");

    cy.get("[data-test-product]")
      .last()
      .find("[data-test-product-name]")
      .should("have.text", "Théière design");
  });

  it("sort by price", () => {
    // Note : Vérifie le tri par prix, numérique croissant

    cy.visit(url);

    cy.get("[data-test-sorter]").click();
    cy.get("[data-test-sorter-price]").click();

    cy.get("[data-test-sorter]").should("contain.text", "Trier par prix");

    cy.get("[data-test-product]")
      .first()
      .find("[data-test-product-name]")
      .should("have.text", "Ananas");

    cy.get("[data-test-product]")
      .last()
      .find("[data-test-product-name]")
      .should("have.text", "Chaussures volantes");
  });

  it("loading", () => {
    // Note : Test la présence d'un spinner lors du chargement

    cy.intercept("http://localhost:3000/api/products", {
      delay: 10000,
    });

    cy.visit(url);

    cy.get("[data-test-loading]").should("exist");
    cy.get("[data-test-error]").should("not.exist");
    cy.get("[data-test-product]").should("not.exist");
  });

  it("error message", () => {
    // Note : Test la présence d'un message d'erreur en cas d'échec au chargement

    cy.intercept("http://localhost:3000/api/products", {
      status: 500,
      response: {},
    });

    cy.visit(url);

    cy.get("[data-test-loading]").should("not.exist");
    cy.get("[data-test-error]").should("exist");
    cy.get("[data-test-product]").should("not.exist");
  });

  it("ready", () => {
    // Note : Test la présence du contenu après que tout est bien chargé

    cy.intercept("http://localhost:3000/api/products");

    cy.visit(url);

    cy.get("[data-test-loading]").should("not.exist");
    cy.get("[data-test-error]").should("not.exist");
    cy.get("[data-test-product]").should("exist");
  });
});
