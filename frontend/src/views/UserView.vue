<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useAuthStore } from "../store/auth";
import { User } from "../interfaces/user";
const { isAuthenticated, userData } = useAuthStore();

const router = useRouter();
const route = useRoute();

const user = ref<User>();
const loading = ref(true);
const error = ref();

let userId = computed(() => route.params.userId);

function fetchUser() {
  fetch(`http://localhost:3000/api/users/${userId.value}`)
    .then((response) => response.json())
    .then((data) => {
      user.value = data;
      loading.value = false;
    })
    .catch((error) => {
      console.error("Error:", error);
      error.value = error;
      loading.value = false;
    });
}

fetchUser();

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString();
};
</script>

<template>
  <div>
    <h1 class="text-center" data-test-username>
      Utilisateur {{ user?.username }}
      <span class="badge rounded-pill bg-primary" data-test-admin v-if="user?.admin">Admin</span>
    </h1>
    <div class="text-center" data-test-loading v-if="loading">
      <span class="spinner-border"></span>
      <span>Chargement en cours...</span>
    </div>
    <div class="alert alert-danger mt-3" data-test-error v-if="error">
      {{ error }}
    </div>
    <div data-test-view>
      <div class="row">
        <div class="col-lg-6">
          <h2>Produits</h2>
          <div class="row">
            <div class="col-md-6 mb-6 py-2" v-for="prod in user?.products" :key="prod.id" data-test-product>
              <div class="card">
                <RouterLink :to="{ name: 'Product', params: { productId: prod.id } }">
                  <img :src="prod.pictureUrl" class="card-img-top" data-test-product-picture />
                </RouterLink>
                <div class="card-body">
                  <h5 class="card-title">
                    <RouterLink :to="{
        name: 'Product',
        params: { productId: prod.id },
      }" data-test-product-name>
                      {{ prod.name }}
                    </RouterLink>
                  </h5>
                  <p class="card-text" data-test-product-description>
                    {{ prod.description }}
                  </p>
                  <p class="card-text" data-test-product-price>
                    Prix de départ : {{ prod.originalPrice }} €
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <h2>Offres</h2>
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">Produit</th>
                <th scope="col">Offre</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="bid in user?.bids" :key="bid.id" data-test-bid>
                <td>
                  <RouterLink :to="{
        name: 'Product',
        params: { productId: bid.productId },
      }" data-test-bid-product>
                    {{ bid.product.name }}
                  </RouterLink>
                </td>
                <td data-test-bid-price>{{ bid.price }} €</td>
                <td data-test-bid-date>{{ formatDate(new Date()) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
