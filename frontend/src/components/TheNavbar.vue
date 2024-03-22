<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useAuthStore } from "../store/auth";

const { isAuthenticated, logout, username } = useAuthStore();
</script>

<template>
  <nav class="navbar navbar-expand-sm bg-primary" data-bs-theme="dark">
    <div class="container">
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="navbar-brand">
            <i class="bi bi-bag-heart-fill"></i>
            BidBay
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link active" :to="{ name: 'Home' }">
              Accueil
            </RouterLink>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <RouterLink
              class="nav-link"
              :to="{ name: 'User', params: { userId: 'me' } }"
            >
              Mon compte
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'AddProduct' }">
              Ajouter un produit
            </RouterLink>
          </li>
        </ul>
        <div class="d-flex">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item" v-if="!isAuthenticated">
              <RouterLink class="nav-link" :to="{ name: 'Login' }">
                Connexion
              </RouterLink>
            </li>
            <li class="nav-item" v-if="!isAuthenticated">
              <RouterLink class="nav-link" :to="{ name: 'Register' }">
                Inscription
              </RouterLink>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <a class="nav-link" href="#" @click="logout">
                Déconnexion ({{ username }})
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>
