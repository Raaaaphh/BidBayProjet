import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AddProductView from "../views/AddProductView.vue";
import EditProductView from "../views/EditProductView.vue";
import ProductView from "../views/ProductView.vue";
import UserView from "../views/UserView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "Register",
      component: RegisterView,
    },
    {
      path: "/products/add",
      name: "AddProduct",
      component: AddProductView,
    },
    {
      path: "/products/:productId/edit",
      name: "ProductEdition",
      component: EditProductView,
    },
    {
      path: "/products/:productId",
      name: "Product",
      component: ProductView,
    },
    {
      path: "/users/:userId",
      name: "User",
      component: UserView,
    },
  ],
});

export default router;
