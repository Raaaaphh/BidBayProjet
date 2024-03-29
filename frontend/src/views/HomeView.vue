<script setup lang="ts">
import { Product } from "@/interfaces/product";
//import { get } from "cypress/types/lodash";
import { ref, computed } from "vue";

const loading = ref(true);
const error = ref(false);
let products = ref<Product[]>();
let var_input = ref("");
let sort = ref("nom");

async function fetchProducts() {
  loading.value = true;
  error.value = false;

  fetch("http://localhost:3000/api/products").then(async (res) => {
    products.value = await res.json()
    loading.value = false;

    sortProducts('name');
  }).catch(() => {
    error.value = true;
    loading.value = false;
  });

}

const filteredProducts = computed(() => {
  if (!products.value) {
    return [];
  }

  return products.value.filter((prod) => {
    return prod.name.toLowerCase().includes(var_input.value.toLowerCase());
  });
});

function sortProducts(type: string) {
  if (type === 'price') {
    products.value = products.value?.sort((a, b) => a.originalPrice - b.originalPrice);
    sort.value = 'prix';
  } else {
    products.value = products.value?.sort((a, b) => a.name.localeCompare(b.name));
    sort.value = 'nom';
  }
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
            <input type="text" class="form-control" placeholder="Filtrer par nom" data-test-filter
              v-model="var_input" />
          </div>
        </form>
      </div>
      <div class="col-md-6 text-end">
        <div class="btn-group">
          <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"
            data-test-sorter>
            Trier par {{ sort }}
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li v-on:click="sortProducts('name')">
              <a class="dropdown-item" href="#"> Nom </a>
            </li>
            <li v-on:click="sortProducts('price')">
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
      <div class="col-md-4 mb-4" v-for="prod in filteredProducts" data-test-product :key="prod.id">
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
              {{ new Date(prod.endDate).toLocaleDateString('en-GB') < new Date().toLocaleDateString('en-GB') ? 'Terminé'
                : "En cours jusqu'au " + new Date(prod.endDate).toLocaleDateString('en-GB') }} </p>
                <p class="card-text" data-test-product-price v-if="prod.bids !== undefined">
                  {{ prod.bids?.length === 0 ? 'Prix départ ' + prod.originalPrice + '€' : 'Prix actuel : '
                + prod.bids[prod.bids.length - 1].price + '€' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
