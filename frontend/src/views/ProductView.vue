<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "../store/auth";
import { Product } from "../interfaces/product";

const { isAuthenticated, isAdmin, userData, token } = useAuthStore();

const route = useRoute();
const router = useRouter();
let error = ref(false);
let loading = ref(true);

const productId = ref(route.params.productId);
let product = ref<Product>();

function getProduct(): void {

  if (!productId.value) {
    error.value = true;
    return;
  }

  console.log(productId.value);

  fetch(`http://localhost:3000/api/products/${productId.value}`)
    .then(async (response) => {
      if (!response.ok) {
        error.value = true;
        loading.value = false;
        return null;
      }
      loading.value = false;
      const responseData = await response.json();
      console.log(responseData);
      product.value = responseData;
    })
    .catch(error => {
      console.error('Error fetching product:', error);
      error.value = true;
      loading.value = false;
    });
}


const countdown = computed(() => {
  getProduct();

  if (!product) {
    return "";
  }


  const endDate = new Date(product.value?.endDate as string).getTime();
  const now = new Date().getTime();
  const diff = endDate - now;

  if (diff <= 0) {
    return "Terminée";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${days} jours, ${hours} heures, ${minutes} minutes et ${seconds} secondes`;
});

/**
 * @param {number|string|Date|VarDate} date
 */
function formatDate(date: string | number | Date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("fr-FR", options as Intl.DateTimeFormatOptions);
}
</script>

<template>
  <div class="row">
    <div class="text-center mt-4" data-test-loading>
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div class="alert alert-danger mt-4" role="alert" data-test-error>
      Une erreur est survenue lors du chargement des produits.
    </div>
    <div class="row" data-test-product>
      <!-- Colonne de gauche : image et compte à rebours -->
      <div class="col-lg-4">
        <img :src="product?.pictureUrl" alt="" class="img-fluid rounded mb-3" data-test-product-picture />
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">Compte à rebours</h5>
          </div>
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-muted" data-test-countdown>
              Temps restant : {{ countdown }}
            </h6>
          </div>
        </div>
      </div>

      <!-- Colonne de droite : informations du produit et formulaire d'enchère -->
      <div class="col-lg-8">
        <div class="row">
          <div class="col-lg-6">
            <h1 class="mb-3" data-test-product-name>
              {{ product?.name }}
            </h1>
          </div>
          <div class="col-lg-6 text-end">
            <RouterLink :to="{ name: 'ProductEdition', params: { productId: product?.id } }" class="btn btn-primary"
              data-test-edit-product>
              Editer
            </RouterLink>
            &nbsp;
            <button class="btn btn-danger" data-test-delete-product>
              Supprimer
            </button>
          </div>
        </div>

        <h2 class="mb-3">Description</h2>
        <p data-test-product-description>
          {{ product?.description }}
        </p>

        <h2 class="mb-3">Informations sur l'enchère</h2>
        <ul>
          <li data-test-product-price>Prix de départ : {{ product?.originalPrice }} €</li>
          <li data-test-product-end-date>Date de fin : {{ new Date(product?.endDate as
          string).toLocaleDateString('en-GB') }}</li>
          <li>
            Vendeur :
            <router-link :to="{ name: 'User', params: { userId: product?.seller?.id } }" data-test-product-seller>
              {{ product?.seller?.username }}
            </router-link>
          </li>
        </ul>

        <h2 class="mb-3">Offres sur le produit</h2>
        <table class="table table-striped" data-test-bids>
          <thead>
            <tr>
              <th scope="col">Enchérisseur</th>
              <th scope="col">Offre</th>
              <th scope="col">Date</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 10" :key="i" data-test-bid>
              <td>
                <router-link :to="{ name: 'User', params: { userId: 'TODO' } }" data-test-bid-bidder>
                  charly
                </router-link>
              </td>
              <td data-test-bid-price>43 €</td>
              <td data-test-bid-date>22 mars 2026</td>
              <td>
                <button class="btn btn-danger btn-sm" data-test-delete-bid>
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p data-test-no-bids>Aucune offre pour le moment</p>

        <form data-test-bid-form>
          <div class="form-group">
            <label for="bidAmount">Votre offre :</label>
            <input type="number" class="form-control" id="bidAmount" data-test-bid-form-price />
            <small class="form-text text-muted">
              Le montant doit être supérieur à 10 €.
            </small>
          </div>
          <button type="submit" class="btn btn-primary" disabled data-test-submit-bid>
            Enchérir
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
