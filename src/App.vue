<template>
  <v-app>
    <article-alert></article-alert>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
<script>
  import ArticleAlert from './components/ArticleAlert.vue';
  export default {
    components: {
      ArticleAlert
    }
  }
</script>