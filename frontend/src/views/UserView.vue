<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useAuthStore } from "../store/auth";

const { isAuthenticated, userData } = useAuthStore();

const router = useRouter();
const route = useRoute();

const user = ref(null);
const loading = ref(false);
const error = ref(null);

let userId = computed(() => route.params.userId);

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString();
};
</script>

<template>
  <div>
    <h1 class="text-center" data-test-username>
      Utilisateur charly
      <span class="badge rounded-pill bg-primary" data-test-admin>Admin</span>
    </h1>
    <div class="text-center" data-test-loading>
      <span class="spinner-border"></span>
      <span>Chargement en cours...</span>
    </div>
    <div class="alert alert-danger mt-3" data-test-error>
      Une erreur est survenue
    </div>
    <div data-test-view>
      <div class="row">
        <div class="col-lg-6">
          <h2>Produits</h2>
          <div class="row">
            <div
              class="col-md-6 mb-6 py-2"
              v-for="i in 10"
              :key="i"
              data-test-product
            >
              <div class="card">
                <RouterLink
                  :to="{ name: 'Product', params: { productId: 'TODO' } }"
                >
                  <img
                    src="https://image.noelshack.com/fichiers/2023/12/4/1679526253-65535-51925549650-96f088a093-b-512-512-nofilter.jpg"
                    class="card-img-top"
                    data-test-product-picture
                  />
                </RouterLink>
                <div class="card-body">
                  <h5 class="card-title">
                    <RouterLink
                      :to="{
                        name: 'Product',
                        params: { productId: 'TODO' },
                      }"
                      data-test-product-name
                    >
                      Chapeau en poil de chameau
                    </RouterLink>
                  </h5>
                  <p class="card-text" data-test-product-description>
                    Ce chapeau en poil de chameau est un véritable chef-d'œuvre
                    artisanal, doux au toucher et résistant pour une durabilité
                    à long terme.
                  </p>
                  <p class="card-text" data-test-product-price>
                    Prix de départ : 23 €
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
              <tr v-for="i in 10" :key="i" data-test-bid>
                <td>
                  <RouterLink
                    :to="{
                      name: 'Product',
                      params: { productId: 'TODO' },
                    }"
                    data-test-bid-product
                  >
                    Théière design
                  </RouterLink>
                </td>
                <td data-test-bid-price>713 €</td>
                <td data-test-bid-date>{{ formatDate(new Date()) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
