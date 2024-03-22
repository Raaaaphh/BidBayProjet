<script setup lang="ts">
import { RouterView } from "vue-router";
import TheNavbar from "./components/TheNavbar.vue";
</script>

<template>
  <TheNavbar />
  <main class="container py-4">
    <RouterView />
  </main>
</template>

<style scoped>
main {
  margin-top: 3.5em;
}
</style>
