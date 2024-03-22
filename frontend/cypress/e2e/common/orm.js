import {
  randomFuturDate,
  randomImageUrl,
  randomIntFromInterval,
  randomPastDate,
  randomSentence,
  randomWord,
} from "./random";
import { aliceToken } from "./tokens";

export function buildProduct(when = "futur") {
  const name = "Aa " + randomSentence(3);
  const description = randomSentence(10);
  const category = randomWord();
  const originalPrice = randomIntFromInterval(1, 100);
  const pictureUrl = randomImageUrl();
  let endDate = when === "past" ? randomPastDate() : randomFuturDate();

  if (when === "ten_days_later") {
    endDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
  }

  return {
    name,
    description,
    category,
    originalPrice,
    pictureUrl,
    endDate,
  };
}

export function createProduct(when = "futur", token = aliceToken) {
  const originalProduct = buildProduct(when);

  return new Promise((resolve) => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/products",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        name: originalProduct.name,
        description: originalProduct.description,
        category: originalProduct.category,
        originalPrice: originalProduct.originalPrice,
        pictureUrl: originalProduct.pictureUrl,
        endDate: originalProduct.endDate.toISOString(),
      },
    }).then((res) => {
      resolve({
        originalProduct,
        product: res.body,
      });
    });
  });
}

export function createBid(productId, currentPrice, token = aliceToken) {
  if (typeof currentPrice !== "number") throw new Error("Not a number");

  const price = currentPrice + randomIntFromInterval(1, 100);

  const originalBid = { price };

  return new Promise((resolve) => {
    cy.request({
      method: "POST",
      url: `http://localhost:3000/api/products/${productId}/bids`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        price,
      },
    }).then((res) => {
      const bid = res.body;

      resolve({
        originalBid,
        bid,
      });
    });
  });
}

export function getProducts() {
  return new Promise((resolve) => {
    cy.request("http://localhost:3000/api/products").then((res) =>
      resolve({ products: res.body })
    );
  });
}

export function getProduct(productId) {
  return new Promise((resolve) => {
    cy.request(`http://localhost:3000/api/products/${productId}`).then((res) =>
      resolve({ product: res.body })
    );
  });
}
