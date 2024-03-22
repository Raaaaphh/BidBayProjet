<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router/dist/vue-router";

const { login, isAuthenticated } = useAuthStore();
const router = useRouter();

if (isAuthenticated.value) {
  router.push({ name: "Home" });
}

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isSubmitting = ref(false);

const registerUser = async () => {
  isSubmitting.value = true;

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      errorMessage.value = error;
    } else {
      const { access_token } = await response.json();
      login(access_token);
      router.push({ name: "Home" });
    }
  } catch (e) {
    errorMessage.value = e as string;
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <h1 class="text-center mb-4">Connexion</h1>

  <div class="row justify-content-center">
    <div class="col-md-6">
      <form @submit.prevent="registerUser">
        <div v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
          {{ errorMessage }}
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Adresse e-mail</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            id="email"
            name="email"
            required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            id="password"
            name="password"
            required
          />
        </div>
        <div class="d-grid gap-2">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "En cours..." : "Se connecter" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
