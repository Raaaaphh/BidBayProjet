<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "../store/auth";

const { isAuthenticated, isAdmin, userData, token } = useAuthStore();

const route = useRoute();
const router = useRouter();
let error = ref("");
let loading = ref(true);
let price = ref(0);

const productId = ref(route.params.productId);
let product = ref();

getProduct();

function getProduct(): void {

  if (!productId.value) {
    error.value = "Aucun produit n'a été trouvé.";
    router.push({ name: "Home" });
  }

  fetch(`http://localhost:3000/api/products/${productId.value}`)
    .then(async (response) => {
      if (!response.ok) {
        if (response.status === 404) {
          error.value = "Le produit n'existe pas.";
          loading.value = false;
          return null;
        }
        error.value = "Une erreur est survenue lors du chargement du produit.";
        loading.value = false;
        return null;
      }
      loading.value = false;
      const responseData = await response.json();
      product.value = responseData;
    })
    .catch(error => {
      error.value = true;
      loading.value = false;
    });
}

function canDeleteProduct(): boolean {
  return isAuthenticated.value && (isAdmin.value || product.value?.seller?.id === userData.value?.id);
}

function canEditBid(bidderId: string): boolean {
  return isAuthenticated.value && (isAdmin.value || bidderId === userData.value?.id);
}

function deleteProduct(): void {
  if (!product.value) {
    return;
  }

  fetch(`http://localhost:3000/api/products/${product.value.id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        if (response.status === 401) {
          error.value = "Vous n'êtes pas autorisé à supprimer ce produit.";
          return;
        }
        error.value = "Le produit n'existe pas ou une erreur est survenue lors de la suppression.";
        return;
      }
      router.push({ name: "Home" });
    })
    .catch(() => {
      error.value = "Une erreur est survenue lors de la suppression du produit.";
    });
}

const countdown = computed(() => {
  if (!product) {
    return "";
  }


  const endDate = new Date(product.value?.endDate as string).getTime();
  const now = new Date().getTime();
  const diff = endDate - now;

  if (diff <= 0) {
    return "Vente terminée";
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
    <div class="text-center mt-4" data-test-loading v-if="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div class="alert alert-danger mt-4" role="alert" data-test-error v-if="error">
      {{ error }}
    </div>
    <div class="row" data-test-product v-if="product">
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
              data-test-edit-product v-if="canDeleteProduct()">
              Editer
            </RouterLink>
            &nbsp;
            <button class="btn btn-danger" data-test-delete-product v-if="canDeleteProduct()" @click="deleteProduct()">
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
          <li data-test-product-end-date>Date de fin : {{ formatDate(product?.endDate) }}</li>
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
            <tr v-for="bid in product.bids" :key="bid.id" v-if="product.bids !== undefined" data-test-bid>
              <td>
                <router-link :to="{ name: 'User', params: { userId: bid.bidderId } }" data-test-bid-bidder>
                  {{ bid.bidder.username }}
                </router-link>
              </td>
              <td data-test-bid-price>{{ bid.price }} €</td>
              <td data-test-bid-date>{{ formatDate(bid.createdAt) }}</td>
              <td>
                <button class="btn btn-danger btn-sm" data-test-delete-bid v-if="canEditBid(bid.bidderId)">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p data-test-no-bids v-if="product.bids?.length === 0">Aucune offre pour le moment</p>

        <form data-test-bid-form>
          <div class="form-group">
            <label for="bidAmount">Votre offre :</label>
            <input type="number" class="form-control" id="bidAmount" data-test-bid-form-price v-model="price" />
            <small class="form-text text-muted" v-if="price <= 10">
              Le montant doit être supérieur à 10 €.
            </small>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="!isAuthenticated || price <= 10"
            data-test-submit-bid>
            Enchérir
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
