import { aliceToken } from "../common/tokens";
import { buildProduct, createProduct } from "../common/orm";
import { prepareDateToType } from "../common/automate";

beforeEach(() => {
  cy.request("http://localhost:3000/api/dev/reset");
});

describe("Page /products/:productId/edit", () => {
  it("post product", () => {
    createProduct().then(({ product }) => {
      // Note : Test le scénario de modification de produit réussi

      cy.visit(`http://localhost:5173/products/${product.id}/edit`, {
        onBeforeLoad: function (window) {
          window.localStorage.setItem("token", aliceToken);
        },
      });

      const newProduct = buildProduct();

      cy.get("[data-test-product-name]").type("{selectAll}{del}");
      cy.get("[data-test-product-name]").type(newProduct.name);
      cy.get("[data-test-product-description]").type("{selectAll}{del}");
      cy.get("[data-test-product-description]").type(newProduct.description);
      cy.get("[data-test-product-category]").type("{selectAll}{del}");
      cy.get("[data-test-product-category]").type(newProduct.category);
      cy.get("[data-test-product-price]").type("{selectAll}{del}");
      cy.get("[data-test-product-price]").type(newProduct.originalPrice);
      cy.get("[data-test-product-picture]").type("{selectAll}{del}");
      cy.get("[data-test-product-picture]").type(newProduct.pictureUrl);
      cy.get("[data-test-product-end-date]").type("{selectAll}{del}");
      cy.get("[data-test-product-end-date]").type(
        prepareDateToType(newProduct.endDate)
      );

      cy.intercept(
        "PUT",
        "http://localhost:3000/api/products/" + product.id
      ).as("putProduct");

      cy.get("[data-test-submit]").click();

      cy.wait("@putProduct").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);

        const id = interception.response.body.id;

        cy.url().should("contain", `/products/${id}`);
      });
    });
  });

  it("display spinner", () => {
    // Note : Test la présence d'un spinner lors de l'envoi de la requête

    createProduct().then(({ product }) => {
      cy.visit(`http://localhost:5173/products/${product.id}/edit`, {
        onBeforeLoad: function (window) {
          window.localStorage.setItem("token", aliceToken);
        },
      });

      const newProduct = buildProduct();

      cy.get("[data-test-product-name]").type("{selectAll}{del}");
      cy.get("[data-test-product-name]").type(newProduct.name);
      cy.get("[data-test-product-description]").type("{selectAll}{del}");
      cy.get("[data-test-product-description]").type(newProduct.description);
      cy.get("[data-test-product-category]").type("{selectAll}{del}");
      cy.get("[data-test-product-category]").type(newProduct.category);
      cy.get("[data-test-product-price]").type("{selectAll}{del}");
      cy.get("[data-test-product-price]").type(newProduct.originalPrice);
      cy.get("[data-test-product-picture]").type("{selectAll}{del}");
      cy.get("[data-test-product-picture]").type(newProduct.pictureUrl);
      cy.get("[data-test-product-end-date]").type("{selectAll}{del}");
      cy.get("[data-test-product-end-date]").type(
        prepareDateToType(newProduct.endDate)
      );

      cy.intercept("PUT", "http://localhost:3000/api/products/" + product.id, {
        delay: 2000,
      }).as("putProduct");

      cy.get("[data-test-submit]").click();

      cy.get("[data-test-submit]").should("have.attr", "disabled");
      cy.get("[data-test-spinner]").should("exist");
    });
  });

  it("display error", () => {
    // Note : Test le scénario d'un ajout de produit avec un échec

    createProduct().then(({ product }) => {
      cy.visit(`http://localhost:5173/products/${product.id}/edit`, {
        onBeforeLoad: function (window) {
          window.localStorage.setItem("token", aliceToken);
        },
      });

      cy.get("[data-test-error]").should("not.exist");

      const newProduct = buildProduct();

      cy.get("[data-test-product-name]").type("{selectAll}{del}");
      cy.get("[data-test-product-name]").type(newProduct.name);
      cy.get("[data-test-product-description]").type("{selectAll}{del}");
      cy.get("[data-test-product-description]").type(newProduct.description);
      cy.get("[data-test-product-category]").type("{selectAll}{del}");
      cy.get("[data-test-product-category]").type(newProduct.category);
      cy.get("[data-test-product-price]").type("{selectAll}{del}");
      cy.get("[data-test-product-price]").type(newProduct.originalPrice);
      cy.get("[data-test-product-picture]").type("{selectAll}{del}");
      cy.get("[data-test-product-picture]").type(newProduct.pictureUrl);
      cy.get("[data-test-product-end-date]").type("{selectAll}{del}");
      cy.get("[data-test-product-end-date]").type(
        prepareDateToType(newProduct.endDate)
      );

      cy.intercept("PUT", "http://localhost:3000/api/products/" + product.id, {
        statusCode: 500,
      }).as("putProduct");

      cy.get("[data-test-submit]").click();

      cy.get("[data-test-error]").should("exist");
    });
  });
});
