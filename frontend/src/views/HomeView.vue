<script setup lang="ts">
import { Product } from "@/interfaces/product";
import { get } from "cypress/types/lodash";
import { ref, computed } from "vue";

const loading = ref(true);
const error = ref(false);
let products = ref<Product[]>();

async function fetchProducts() {
  loading.value = true;
  error.value = false;

  fetch("http://localhost:3000/api/products").then(async (res) => {
    products.value = await res.json()
    loading.value = false;
  }).catch(() => {
    error.value = true;
    loading.value = false;
  });

}

fetchProducts();
</script>

<template>
  <div>
    <h1 class="text-center mb-4">Liste des produits</h1>

    <div class="row mb-3">
      <div class="col-md-6">
        <form>
          <div class="input-group">
            <span class="input-group-text">Filtrage</span>
            <input type="text" class="form-control" placeholder="Filtrer par nom" data-test-filter />
          </div>
        </form>
      </div>
      <div class="col-md-6 text-end">
        <div class="btn-group">
          <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"
            data-test-sorter>
            Trier par nom
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <a class="dropdown-item" href="#"> Nom </a>
            </li>
            <li>
              <a class="dropdown-item" href="#" data-test-sorter-price>
                Prix
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="text-center mt-4" data-test-loading v-if="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div class="alert alert-danger mt-4" role="alert" data-test-error v-if="error">
      Une erreur est survenue lors du chargement des produits.
    </div>
    <div class="row">
      <div class="col-md-4 mb-4" v-for="prod in products" data-test-product :key="prod.id">
        <div class="card">
          <RouterLink :to="{ name: 'Product', params: { productId: prod.id } }">
            <img :src="prod.pictureUrl" data-test-product-picture class="card-img-top" />
          </RouterLink>
          <div class="card-body">
            <h5 class="card-title">
              <RouterLink data-test-product-name :to="{ name: 'Product', params: { productId: prod.id } }">
                {{ prod.name }}
              </RouterLink>
            </h5>
            <p class="card-text" data-test-product-description>
              {{ prod.description }}
            </p>
            <p class="card-text">
              Vendeur :
              <RouterLink v-if="prod.seller" data-test-product-seller
                :to="{ name: 'User', params: { userId: prod.seller.id } }">
                {{ prod.seller.username }}
              </RouterLink>
            </p>
            <p class="card-text" data-test-product-date>
              En cours jusqu'au {{ new Date(prod.endDate).toLocaleDateString('en-GB') }}
            </p>
            <p class="card-text" data-test-product-price>Prix actuel : {{ prod.originalPrice }} €</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
