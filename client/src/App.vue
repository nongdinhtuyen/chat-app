<script setup lang="ts">
import { ConfigProvider, theme } from 'ant-design-vue'
import { computed, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import utils from './common/utils'
import { baseRequest } from './requests/baseRequest'

const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
const themeAlgorithm = computed(() => {
  return prefersDark ? theme.darkAlgorithm : theme.defaultAlgorithm
})

onMounted(() => {
  if (utils.getAccessToken()) {
    baseRequest.defaults.headers.common.Authorization = `Bearer ${utils.getAccessToken()}`
  }
})
</script>

<template>
  <header>
    <!-- <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/user">User</RouterLink>
      <RouterLink to="/chat">Chat</RouterLink>
      <RouterLink to="/messenger">Messenger</RouterLink>
    </nav> -->
  </header>

  <ConfigProvider
    :theme="{
      hashed: false,
      algorithm: themeAlgorithm,
      token: {
        fontFamily: 'IBM Plex Sans, sans-serif',
      },
    }"
  >
    <RouterView />
  </ConfigProvider>
  <!-- <MessengerLayout /> -->
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    font-size: 1rem;
    padding: 1rem 0;
  }
}
</style>
