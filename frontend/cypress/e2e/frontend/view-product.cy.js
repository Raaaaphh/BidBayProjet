import {
  createBid,
  createProduct,
  getProduct,
  getProducts,
} from "../common/orm";
import {
  adminToken,
  aliceId,
  aliceToken,
  bobId,
  bobToken,
  casserolesId,
  charlyId,
  charlyToken,
} from "../common/tokens";

beforeEach(() => {
  cy.request("http://localhost:3000/api/dev/reset");
});

describe("Page /products/:productId", async () => {
  it("display product", () => {
    // Note : Vérifie que tous les éléments du produit sont bien affichés

    createProduct().then(({ originalProduct, product }) => {
      cy.visit(`http://localhost:5173/products/${product.id}`);

      cy.get("[data-test-product-name]").should("have.text", product.name);
      cy.get("[data-test-product-description]").should(
        "have.text",
        product.description
      );
      cy.get("[data-test-product-picture]")
        .invoke("attr", "src")
        .should("eq", product.pictureUrl);
      cy.get("[data-test-product-price]").should(
        "contain.text",
        product.originalPrice + " €"
      );
      cy.get("[data-test-product-end-date]").should(
        "contain.text",
        originalProduct.endDate.toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
      cy.get("[data-test-product-seller]")
        .should("have.text", "alice")
        .invoke("attr", "href")
        .should("contain", aliceId);
    });
  });

  it("finished countdown", () => {
    // Note : Si la date de fin de vente est passée, on affiche "Terminé"

    createProduct("past").then(({ product }) => {
      cy.visit(`http://localhost:5173/products/${product.id}`);

      cy.get("[data-test-countdown]").should("contain.text", "Terminé");
    });
  });

  it("not finished countdown", () => {
    // Note : Si la date de fin de vente est passée, on n'affiche pas "Terminé"

    createProduct("futur").then(({ product }) => {
      cy.visit(`http://localhost:5173/products/${product.id}`);

      cy.get("[data-test-countdown]").should("not.contain.text", "Terminé");
    });
  });

  it("display bids", () => {
    // Note : Vérifie que tous les éléments des offres du produit sont bien affichés

    createBid(casserolesId, 200, bobToken).then(({ bid }) => {
      cy.visit(`http://localhost:5173/products/${casserolesId}`);

      cy.get("[data-test-bid]").should("have.length", 4);

      cy.get("[data-test-bid]")
        .first()
        .find("[data-test-bid-bidder]")
        .should("have.text", "charly")
        .invoke("attr", "href")
        .should("contain", charlyId);

      cy.get("[data-test-bid]")
        .first()
        .find("[data-test-bid-price]")
        .should("contain.text", "65 €");

      cy.get("[data-test-bid]")
        .last()
        .find("[data-test-bid-bidder]")
        .should("have.text", "bob")
        .invoke("attr", "href")
        .should("contain", bobId);

      cy.get("[data-test-bid]")
        .last()
        .find("[data-test-bid-price]")
        .should("contain.text", bid.price + " €");

      cy.get("[data-test-bid]")
        .last()
        .find("[data-test-bid-date]")
        .should(
          "contain.text",
          new Date().toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        );
    });
  });

  it("some bids", () => {
    // Note : Si au moins une offre existe, on affiche le tableau

    cy.visit(`http://localhost:5173/products/${casserolesId}`);

    cy.get("[data-test-bids]").should("exist");
    cy.get("[data-test-no-bids]").should("not.exist");
  });

  it("no bids", () => {
    createProduct().then(({ product }) => {
      // Note : Si aucune une offre ,'existe, on masque le tableau

      cy.visit(`http://localhost:5173/products/${product.id}`);

      cy.get("[data-test-bids]").should("not.exist");
      cy.get("[data-test-no-bids]").should("exist");
    });
  });

  it("only seller and admin can edit or delete product", () => {
    // Note : Vérifie que l'admin a accès aux boutons d'édition et de suppression
    // Note : Vérifie que l'utilisateur vendeur du produit a accès aux boutons d'édition et de suppression
    // Note : Vérifie qu'un utilisateur non vendeur du produit n'a pas accès aux boutons d'édition et de suppression

    cy.visit(`http://localhost:5173/products/${casserolesId}`, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem("token", adminToken);
      },
    });

    cy.get("[data-test-edit-product]").should("exist");
    cy.get("[data-test-delete-product]").should("exist");

    cy.visit(`http://localhost:5173/products/${casserolesId}`, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem("token", aliceToken);
      },
    });

    cy.get("[data-test-edit-product]").should("exist");
    cy.get("[data-test-delete-product]").should("exist");

    cy.visit(`http://localhost:5173/products/${casserolesId}`, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem("token", bobToken);
      },
    });

    cy.get("[data-test-edit-product]").should("not.exist");
    cy.get("[data-test-delete-product]").should("not.exist");
  });

  it("product edition button", () => {
    // Note : Vérifie que bouton d'édition d'un produit cible le bon endroit

    cy.visit(`http://localhost:5173/products/${casserolesId}`, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem("token", aliceToken);
      },
    });

    cy.get("[data-test-edit-product]")
      .should("exist")
      .invoke("attr", "href")
      .should("contain", casserolesId)
      .should("contain", "/edit");
  });

  it("product deletion button", () => {
    // Note : Vérifie que bouton de suppression d'un produit supprime bien le produit

    cy.visit(`http://localhost:5173/products/${casserolesId}`, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem("token", aliceToken);
      },
    });

    getProducts().then(({ products: productsBeforeDeletion }) => {
      cy.get("[data-test-delete-product]").click();

      getProducts().then(({ products: productsAfterDeletion }) => {
        expect(productsBeforeDeletion.length).to.be.greaterThan(
          productsAfterDeletion.length
        );
      });
    });
  });

  it("admin can delete bid", () => {
    // Note : Vérifie que l'admin peut supprimer n'importe quel offre

    cy.visit(`http://localhost:5173/products/${casserolesId}`, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem("token", adminToken);
      },
    });

    cy.get("[data-test-delete-bid]").should("have.length", 3);
  });

  it("bidder can delete bid", () => {
    // Note : Vérifie qu'une offre est supprimable par l'utilisateur l'ayant fait

    cy.visit(`http://localhost:5173/products/${casserolesId}`, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem("token", bobToken);
      },
    });

    cy.get("[data-test-delete-bid]").should("have.length", 1);

    cy.visit(`http://localhost:5173/products/${casserolesId}`, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem("token", charlyToken);
      },
    });

    cy.get("[data-test-delete-bid]").should("have.length", 2);
  });

  it("not bidder cannot delete bid", () => {
    // Note : Vérifie qu'une offre n'est supprimable par un utilisateur ne l'ayant pas fait

    cy.visit(`http://localhost:5173/products/${casserolesId}`, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem("token", aliceToken);
      },
    });

    cy.get("[data-test-delete-bid]").should("have.length", 0);
  });

  it("bid deletion button", () => {
    // Note : Vérifie que le bouton de suppression d'une offre fonctionne bien

    cy.visit(`http://localhost:5173/products/${casserolesId}`, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem("token", bobToken);
      },
    });

    cy.get("[data-test-delete-bid]").should("have.length", 1);

    getProduct(casserolesId).then(({ product: productBeforeBidDeletion }) => {
      cy.get("[data-test-delete-bid]").click();

      cy.get("[data-test-delete-bid]").should("have.length", 0);

      getProduct(casserolesId).then(({ product: productAfterBidDeletion }) => {
        expect(productBeforeBidDeletion.bids.length).to.be.greaterThan(
          productAfterBidDeletion.bids.length
        );
      });
    });
  });
  it("only seller cannot add a bid", () => {
    // Note : Vérifie que le vendeur ne peut pas faire d'offre sur son produit
    // Note : Vérifie qu'un non-vendeur peut faire une offre sur le produit

    cy.visit(`http://localhost:5173/products/${casserolesId}`, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem("token", aliceToken);
      },
    });

    cy.get("[data-test-submit-bid]").should("not.exist");

    cy.visit(`http://localhost:5173/products/${casserolesId}`, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem("token", bobToken);
      },
    });

    cy.get("[data-test-submit-bid]").should("exist");
  });

  it("require minimum bid amount", () => {
    // Note : Vérifie que le formulaire d'offre est validable seulement quand l'offre est supérieur au prix de départ et à la plus haute offre

    cy.visit(`http://localhost:5173/products/${casserolesId}`, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem("token", bobToken);
      },
    });

    cy.get("[data-test-bid-form-price]").type("{selectAll}{del}").type(100);

    cy.get("[data-test-submit-bid]").should("have.attr", "disabled");

    cy.get("[data-test-bid-form-price]").type("{selectAll}{del}").type(200);

    cy.get("[data-test-submit-bid]").should("not.have.attr", "disabled");
  });

  it("preset minimum bid amount", () => {
    // Note : Vérifie que le formulaire d'offre vaut part défaut le prix de la plus haute offre + 1€

    createProduct("futur", aliceToken).then(({ product }) => {
      createBid(product.id, product.originalPrice, bobToken).then(({ bid }) => {
        cy.visit(`http://localhost:5173/products/${product.id}`, {
          onBeforeLoad: function (window) {
            window.localStorage.setItem("token", charlyToken);
          },
        });

        cy.get("[data-test-bid-form-price]").should(
          "have.value",
          bid.price + 1
        );
      });
    });
  });
  it("add a bid", () => {
    // Note : Vérifie que la soumission du formulaire d'offre ajoute bien une offre

    cy.visit(`http://localhost:5173/products/${casserolesId}`, {
      onBeforeLoad: function (window) {
        window.localStorage.setItem("token", bobToken);
      },
    });

    cy.get("[data-test-bid-form-price]").type("{selectAll}{del}").type(200);

    getProduct(casserolesId).then(({ product: productBeforeBidAddition }) => {
      cy.get("[data-test-submit-bid]").click();

      getProduct(casserolesId).then(({ product: productAfterBidAddition }) => {
        expect(productAfterBidAddition.bids.length).greaterThan(
          productBeforeBidAddition.bids.length
        );

        const lastBid =
          productAfterBidAddition.bids[productAfterBidAddition.bids.length - 1];

        expect(lastBid.price).to.eq(200);
      });
    });
  });
  it("pending countdown", () => {
    // Note : Vérifie le décompte du compte à rebours, afficher au format 9j 23h 59m 59s

    createProduct("ten_days_later").then(({ product }) => {
      cy.visit(`http://localhost:5173/products/${product.id}`);

      cy.get("[data-test-countdown]").should("contain.text", "9j 23h 59min");

      cy.get("[data-test-countdown]").then((el) => {
        const instantOne = el.text();
        expect(instantOne).to.match(/\ds$/);
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);

        cy.get("[data-test-countdown]").then((el) => {
          const instantTwo = el.text();
          expect(instantOne).to.match(/\ds$/);

          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(1000);

          expect(instantTwo).not.eq(instantOne);

          cy.get("[data-test-countdown]").then((el) => {
            const instantThree = el.text();
            expect(instantOne).to.match(/\ds$/);

            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(1000);

            expect(instantThree).not.eq(instantTwo);
          });
        });
      });
    });
  });

  it("loading", () => {
    // Note : Vérifie la présence d'un spinner au chargement

    cy.intercept("http://localhost:3000/api/products", {
      delay: 10000,
    });

    cy.visit(`http://localhost:5173/products/${casserolesId}`);

    cy.get("[data-test-loading]").should("exist");
    cy.get("[data-test-error]").should("not.exist");
    cy.get("[data-test-product]").should("not.exist");
  });

  it("error message", () => {
    // Note : Vérifie la présence d'une erreur en cas d'échec de chargement

    cy.intercept(`http://localhost:3000/api/products/${casserolesId}`, {
      statusCode: 500,
    });

    cy.visit(`http://localhost:5173/products/${casserolesId}`);

    cy.get("[data-test-loading]").should("not.exist");
    cy.get("[data-test-error]").should("exist");
    cy.get("[data-test-product]").should("not.exist");
  });

  it("ready", () => {
    // Note : Vérifie la présence du contenu quand tout s'est bien chargé

    cy.intercept(`http://localhost:3000/api/products/${casserolesId}`);

    cy.visit(`http://localhost:5173/products/${casserolesId}`);

    cy.get("[data-test-loading]").should("not.exist");
    cy.get("[data-test-error]").should("not.exist");
    cy.get("[data-test-product]").should("exist");
  });
});
