<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router/dist/vue-router";

const { login, isAuthenticated } = useAuthStore();
const router = useRouter();

if (isAuthenticated.value) {
  router.push({ name: "Home" });
}

const name = ref("");
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const errorMessage = ref("");
const isSubmitting = ref(false);

const notMatchingPassword = computed(
  () => password.value !== passwordConfirmation.value
);

const registerUser = async () => {
  if (notMatchingPassword.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: name.value,
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
  <h1 class="text-center mb-4">Inscription</h1>

  <div class="row justify-content-center">
    <div class="col-md-6">
      <form @submit.prevent="registerUser">
        <div v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
          {{ errorMessage }}
        </div>

        <div class="mb-3">
          <label for="name" class="form-label">Nom d'utilisateur</label>
          <input
            v-model="name"
            type="text"
            class="form-control"
            id="name"
            name="name"
            required
          />
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
        <div class="mb-3">
          <label for="repassword" class="form-label">
            Répéter le mot de passe
          </label>
          <input
            v-model="passwordConfirmation"
            type="password"
            class="form-control"
            id="repassword"
            name="repassword"
            required
          />
          <div v-if="notMatchingPassword" class="text-danger">
            Les mots de passe ne correspondent pas.
          </div>
        </div>
        <div class="d-grid gap-2">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isSubmitting || notMatchingPassword"
          >
            {{ isSubmitting ? "En cours..." : "S'inscrire" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
