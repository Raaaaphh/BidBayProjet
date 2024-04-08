<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "../store/auth";
import { Product } from "@/interfaces/product";

const { isAuthenticated, isAdmin, userData, token } = useAuthStore();

const route = useRoute();
const router = useRouter();
let highestBid = ref(0);
let errorMessage = ref("");
let loading = ref(true);
let price = ref(0);
let countdown = ref("");

const productId = ref(route.params.productId);
let product = ref<Product>();


function getProduct(): void {
  loading.value = true;
  errorMessage.value = "";
  if (!productId.value) {
    errorMessage.value = "Aucun produit n'a été trouvé.";
    router.push({ name: "Home" });
  }

  fetch(`http://localhost:3000/api/products/${productId.value}`)
    .then(async (response) => {
      loading.value = false;
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Le produit n'existe pas.");
        }
        throw new Error("Une erreur est survenue lors de la récupération du produit.");
      }


      const responseData = await response.json();
      product.value = responseData;

      if (product.value?.bids) {
        for (const bid of product.value.bids) {
          if (bid.price > highestBid.value) {
            highestBid.value = bid.price;
          }
        }
      }

      price.value = highestBid.value + 1;

      refreshCountdown();
    })
    .catch((error) => {
      errorMessage.value = error.message;
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
          throw new Error("Vous n'êtes pas autorisé à supprimer ce produit.");
        }
        throw new Error("Le produit n'existe pas ou une erreur est survenue lors de la suppression.");
      }
      router.push({ name: "Home" });
    })
    .catch((error) => {
      errorMessage.value = error.message;
    });
}

function deleteBid(bidId: string): void {
  if (!product.value) {
    return;
  }

  fetch(`http://localhost:3000/api/bids/${bidId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Vous n'êtes pas autorisé à supprimer cette offre.");
        }
        throw new Error("L'offre n'existe pas ou une erreur est survenue lors de la suppression.");
      }
      getProduct();
    })
    .catch((error) => {
      errorMessage.value = error.message;
    });
}

function submitBid(): void {
  if (!product.value) {
    return;
  }

  fetch(`http://localhost:3000/api/products/${product.value.id}/bids`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.value}`,
    },
    body: JSON.stringify({ price: price.value }),
  })
    .then(async (response) => {
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Vous devez être connecté pour enchérir.");
        }
        const responseData = await response.json();
        throw new Error(responseData.details);
      }
      getProduct();
    })
    .catch((error) => {
      errorMessage.value = error.message;
    });
}

function refreshCountdown() {
  if (!product.value) {
    return "";
  }

  const endDate = new Date(product.value?.endDate as string).getTime();
  const now = new Date().getTime();
  const diff = endDate - now;

  if (diff <= 0) {
    countdown.value = "Terminé";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  countdown.value = `Temps restant : ${days}j ${hours}h ${minutes}min ${seconds}s`;
}

/**
 * @param {number|string|Date|VarDate} date
 */
function formatDate(date: string | number | Date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("fr-FR", options as Intl.DateTimeFormatOptions);
}

getProduct();

for (; ;) {
  setInterval(refreshCountdown, 1000);
  break;
}


</script>

<template>
  <div class="row">
    <div class="text-center mt-4" data-test-loading v-if="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div class="alert alert-danger mt-4" role="alert" data-test-error v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <div class="row" data-test-product v-if="product && !errorMessage && !loading">
      <!-- Colonne de gauche : image et compte à rebours -->
      <div class="col-lg-4">
        <img :src="product?.pictureUrl" alt="" class="img-fluid rounded mb-3" data-test-product-picture />
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">Compte à rebours</h5>
          </div>
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-muted" data-test-countdown>
              {{ countdown }}
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
            <RouterLink :to="{ name: 'ProductEdition', params: { productId: product.id } }" class="btn btn-primary"
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
          <li data-test-product-price>Prix de départ : {{ product.originalPrice }} €</li>
          <li data-test-product-end-date>Date de fin : {{ formatDate(product.endDate) }}</li>
          <li>
            Vendeur :
            <router-link :to="{ name: 'User', params: { userId: 'product.seller?.id' } }" data-test-product-seller>
              {{ product.seller?.username }}
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
          <tbody v-if="product.bids !== undefined">
            <tr v-for="bid in product.bids" :key="bid.id" data-test-bid>
              <td>
                <router-link :to="{ name: 'User', params: { userId: bid.bidderId } }" data-test-bid-bidder>
                  {{ bid.bidder.username }}
                </router-link>
              </td>
              <td data-test-bid-price>{{ bid.price }} €</td>
              <td data-test-bid-date>{{ formatDate(bid.createdAt) }}</td>
              <td>
                <button class="btn btn-danger btn-sm" data-test-delete-bid @click="deleteBid(bid.id)"
                  v-if="canEditBid(bid.bidderId)">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p data-test-no-bids v-if="product.bids?.length === 0">Aucune offre pour le moment</p>

        <form data-test-bid-form @submit.prevent="submitBid">
          <div class="form-group">
            <label for="bidAmount">Votre offre :</label>
            <input type="number" class="form-control" id="bidAmount" data-test-bid-form-price v-model="price" />
            <small class="form-text text-muted" v-if="price <= 10">
              Le montant doit être supérieur à 10 €.
            </small>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="!isAuthenticated || price <= highestBid"
            data-test-submit-bid>
            Enchérir
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
