<script setup lang="ts">
import { ref, computed } from "vue";

const loading = ref(false);
const error = ref(false);

async function fetchProducts() {
  loading.value = true;
  error.value = false;

  try {
  } catch (e) {
    error.value = true;
  } finally {
    loading.value = false;
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
            <input
              type="text"
              class="form-control"
              placeholder="Filtrer par nom"
              data-test-filter
            />
          </div>
        </form>
      </div>
      <div class="col-md-6 text-end">
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-primary dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            data-test-sorter
          >
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

    <div class="text-center mt-4" data-test-loading>
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div class="alert alert-danger mt-4" role="alert" data-test-error>
      Une erreur est survenue lors du chargement des produits.
    </div>
    <div class="row">
      <div class="col-md-4 mb-4" v-for="i in 10" data-test-product :key="i">
        <div class="card">
          <RouterLink :to="{ name: 'Product', params: { productId: 'TODO' } }">
            <img
              src="https://picsum.photos/id/403/512/512"
              data-test-product-picture
              class="card-img-top"
            />
          </RouterLink>
          <div class="card-body">
            <h5 class="card-title">
              <RouterLink
                data-test-product-name
                :to="{ name: 'Product', params: { productId: 'TODO' } }"
              >
                Machine à écrire
              </RouterLink>
            </h5>
            <p class="card-text" data-test-product-description>
              Machine à écrire vintage en parfait état de fonctionnement
            </p>
            <p class="card-text">
              Vendeur :
              <RouterLink
                data-test-product-seller
                :to="{ name: 'User', params: { userId: 'TODO' } }"
              >
                alice
              </RouterLink>
            </p>
            <p class="card-text" data-test-product-date>
              En cours jusqu'au 05/04/2026
            </p>
            <p class="card-text" data-test-product-price>Prix actuel : 42 €</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
