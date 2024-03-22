import { computed, ref, watch } from "vue";
import { jwtDecode } from "jwt-decode";
import {Token} from '../../../backend/types/types'

const token = ref(localStorage.getItem("token") || null);

try {
  jwtDecode(token.value ?? '');
} catch {
  token.value = null;
}

const userData = computed(() => {
  if (!token.value) return null;
  return jwtDecode(token.value) as Token;
});

watch(token, () => {
  if (token.value) {
    localStorage.setItem("token", token.value);
  } else {
    localStorage.removeItem("token");
  }
});

const isAuthenticated = computed(() => userData.value !== null);

const isAdmin = computed(() => userData.value !== null && userData.value.admin);

const username = computed(() => userData.value?.username ?? '');

export function useAuthStore() {
  return {
    userData,
    token,
    isAuthenticated,
    isAdmin,
    username,
    login,
    logout,
  };
}

function login(_token: string) {
  token.value = _token;
}

function logout() {
  token.value = null;
}
