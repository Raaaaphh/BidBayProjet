import { aliceToken } from "../common/tokens";
import { createProduct } from "../common/orm";
import { prepareDateToType } from "../common/automate";

beforeEach(() => {
  cy.request("http://localhost:3000/api/dev/reset");
});

const url = "http://localhost:5173/products/add";

describe("Page /products/add", () => {
  it("post product", () => {
    // Note : Test le scénario d'un ajout de produit réussi

    cy.visit(url, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem("token", aliceToken);
      },
    });

    createProduct().then(({ originalProduct, product }) => {
      cy.get("[data-test-product-name]").type(product.name);
      cy.get("[data-test-product-description]").type(product.description);
      cy.get("[data-test-product-category]").type(product.category);
      cy.get("[data-test-product-price]").type(product.originalPrice);
      cy.get("[data-test-product-picture]").type("{selectAll}{del}");
      cy.get("[data-test-product-picture]").type(product.pictureUrl);
      cy.get("[data-test-product-end-date]").type(
        prepareDateToType(originalProduct.endDate)
      );

      cy.intercept("POST", "http://localhost:3000/api/products").as(
        "postProduct"
      );

      cy.get("[data-test-submit]").click();

      cy.wait("@postProduct").then((interception) => {
        expect(interception.response.statusCode).to.eq(201);

        const id = interception.response.body.id;

        cy.url().should("contain", `/products/${id}`);
      });
    });
  });

  it("display spinner", () => {
    // Note : Test la présence d'un spinner lors de l'envoi de la requête

    cy.visit(url, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem("token", aliceToken);
      },
    });

    createProduct().then(({ originalProduct, product }) => {
      cy.get("[data-test-product-name]").type(product.name);
      cy.get("[data-test-product-description]").type(product.description);
      cy.get("[data-test-product-category]").type(product.category);
      cy.get("[data-test-product-price]").type(product.originalPrice);
      cy.get("[data-test-product-picture]").type("{selectAll}{del}");
      cy.get("[data-test-product-picture]").type(product.pictureUrl);
      cy.get("[data-test-product-end-date]").type(
        prepareDateToType(originalProduct.endDate)
      );
      cy.intercept("POST", "http://localhost:3000/api/products", {
        delay: 2000,
      }).as("postProduct");

      cy.get("[data-test-submit]").click();

      cy.get("[data-test-submit]").should("have.attr", "disabled");
      cy.get("[data-test-spinner]").should("exist");
    });
  });

  it("display error", () => {
    // Note : Test le scénario d'un ajout de produit avec un échec
    cy.visit(url, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem("token", aliceToken);
      },
    });

    cy.get("[data-test-error]").should("not.exist");

    createProduct().then(({ originalProduct, product }) => {
      cy.get("[data-test-product-name]").type(product.name);
      cy.get("[data-test-product-description]").type(product.description);
      cy.get("[data-test-product-category]").type(product.category);
      cy.get("[data-test-product-price]").type(product.originalPrice);
      cy.get("[data-test-product-picture]").type("{selectAll}{del}");
      cy.get("[data-test-product-picture]").type(product.pictureUrl);
      cy.get("[data-test-product-end-date]").type(
        prepareDateToType(originalProduct.endDate)
      );

      cy.intercept("POST", "http://localhost:3000/api/products", {
        statusCode: 500,
      }).as("postProduct");

      cy.get("[data-test-submit]").click();

      cy.get("[data-test-error]").should("exist");
    });
  });
});
