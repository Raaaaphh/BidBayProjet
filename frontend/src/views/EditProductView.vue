<script setup lang="ts">
import { useAuthStore } from "../store/auth";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import { Product } from "@/interfaces/product";

const { isAuthenticated, token } = useAuthStore();
const router = useRouter();
const route = useRoute();

let loading = ref(false);
let loadingProduct = ref(true);
let error = ref("");
let product: Product = {
  id: "",
  name: "",
  description: "",
  category: "",
  originalPrice: 0,
  pictureUrl: "",
  endDate: "",
};

const productId = ref(route.params.productId);

if (!isAuthenticated.value) {
  router.push({ name: "Login" });
}

function dateToInput(date: string): string {
  return date.split("T")[0];
}

function getProduct() {
  fetch(`http://localhost:3000/api/products/${productId.value}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.value}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Une erreur s'est produite");
      }

      return response.json();
    })
    .then((data) => {
      product = data;
      product.endDate = dateToInput(product.endDate);
      loadingProduct.value = false;
    })
    .catch((error) => {
      error.value = error.message;
      error.value = true;
    });
}

getProduct();

function editProduct() {
  error.value = "";
  loading.value = true;

  if (
    product.name === "" ||
    product.description === "" ||
    product.category === "" ||
    product.pictureUrl === "" ||
    product.endDate === ""
  ) {
    error.value = "Veuillez remplir tous les champs";
    return;
  }

  fetch(`http://localhost:3000/api/products/${productId.value}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.value}`,
    },
    body: JSON.stringify(product),
  })
    .then(async (response) => {
      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.details);
      }

      return response.json();
    })
    .then((data) => {
      router.push({ name: "Product", params: { productId: data.id } });
    })
    .catch((error) => {
      error.value = error.message;
      error.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<template>
  <h1 class="text-center">Modifier un produit</h1>

  <div class="row justify-content-center">
    <div class="col-md-6">
      <form @submit.prevent="editProduct" v-if="!loadingProduct">
        <div class="alert alert-danger mt-4" role="alert" data-test-error v-if="error">
          {{ error }}
        </div>

        <div class="mb-3">
          <label for="product-name" class="form-label"> Nom du produit </label>
          <input type="text" class="form-control" id="product-name" required data-test-product-name
            v-model="product.name" />
        </div>

        <div class="mb-3">
          <label for="product-description" class="form-label">
            Description
          </label>
          <textarea class="form-control" id="product-description" name="description" rows="3" required
            v-model="product.description" data-test-product-description></textarea>
        </div>

        <div class="mb-3">
          <label for="product-category" class="form-label"> Catégorie </label>
          <input type="text" class="form-control" id="product-category" required data-test-product-category
            v-model="product.category" />
        </div>

        <div class="mb-3">
          <label for="product-original-price" class="form-label">
            Prix de départ
          </label>
          <div class="input-group">
            <input type="number" class="form-control" id="product-original-price" name="originalPrice" step="1" min="0"
              required data-test-product-price v-model="product.originalPrice" />
            <span class="input-group-text">€</span>
          </div>
        </div>

        <div class="mb-3">
          <label for="product-picture-url" class="form-label">
            URL de l'image
          </label>
          <input type="url" class="form-control" id="product-picture-url" name="pictureUrl" required
            data-test-product-picture v-model="product.pictureUrl" />
        </div>

        <div class="mb-3">
          <label for="product-end-date" class="form-label">
            Date de fin de l'enchère
          </label>
          <input type="date" class="form-control" id="product-end-date" name="endDate" required
            data-test-product-end-date v-model="product.endDate" />
        </div>

        <div class="d-grid gap-2">
          <button type="submit" class="btn btn-primary" :disabled="loading" data-test-submit>
            Modifier le produit
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" data-test-spinner
              v-if="loading"></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
