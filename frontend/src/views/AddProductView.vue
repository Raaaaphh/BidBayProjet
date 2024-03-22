<script setup lang="ts">
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";

const { isAuthenticated, token } = useAuthStore();
const router = useRouter();

let error = ref(false);
let loading = ref(false);
let errorMessage = ref("");
let product = {
  name: "",
  description: "",
  category: "",
  originalPrice: 0,
  pictureUrl: "",
  endDate: "",
};

if (!isAuthenticated.value) {
  router.push({ name: "Login" });
}

function addProduct() {
  error.value = false;
  errorMessage.value = "";
  loading.value = true;

  if (product.name === "" || product.description === "" || product.category === "" || product.pictureUrl === "" || product.endDate === "") {
    errorMessage.value = "Veuillez remplir tous les champs";
    return;
  }

  fetch(`http://localhost:3000/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.value}`,
    },
    body: JSON.stringify(product),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Une erreur s'est produite");
      }

      return response.json();
    })
    .then((data) => {
      router.push({ name: "Product", params: { productId: data.id } });
    })
    .catch((error) => {
      errorMessage.value = error.message;
      error.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
}

// router.push({ name: "Product", params: { productId: 'TODO } });
</script>

<template>
  <h1 class="text-center">Ajouter un produit</h1>

  <div class="row justify-content-center">
    <div class="col-md-6">
      <form @submit.prevent="addProduct">
        <div class="alert alert-danger mt-4" role="alert" data-test-error v-if="error != false">
          Une erreur s'est produite {{ error }}
        </div>

        <div class="mb-3">
          <label for="product-name" class="form-label"> Nom du produit </label>
          <input type="text" class="form-control" id="product-name" v-model="product.name" required
            data-test-product-name />
        </div>

        <div class="mb-3">
          <label for="product-description" class="form-label">
            Description
          </label>
          <textarea class="form-control" id="product-description" name="description" rows="3" required
            data-test-product-description v-model="product.description"></textarea>
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
            Ajouter le produit
            <span data-test-spinner class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
              v-if="loading"></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
