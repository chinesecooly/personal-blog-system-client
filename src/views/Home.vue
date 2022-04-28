<template>
  <v-container style="height:800px" fluid>
    <blog-bar></blog-bar>
    <blog-header></blog-header>
    <blog-category @getClassifiedArticles="getClassifiedArticles($event)"></blog-category>
    <blog-card v-for="card in cards" :key="card.title" :articleInfo="card"></blog-card>
    <div class="text-center mt-3">
      <v-pagination v-model="pageNumber" :length="pageCount" :total-visible="5" @input="getPage(pageNumber)">
      </v-pagination>
    </div>
    <blog-top></blog-top>
    <blog-user></blog-user>
    <blog-footer></blog-footer>
  </v-container>
</template>

<script>
  import BlogCard from '../components/BlogCard.vue';
  import BlogHeader from '../components/BlogHeader.vue';
  import BlogCategory from '../components/BlogCategory.vue';
  import BlogBar from '../components/BlogBar.vue'
  import BlogFooter from '../components/BlogFooter.vue'
  import BlogUser from '../components/BlogUser.vue';
  import BlogTop from '../components/BlogTop.vue';
  export default {
    data() {
      return {
        cards: [],
        pageNumber: 1,
        pageCount: 10,
        categoryId: -1
      }
    },
    mounted() {
      this.getPageCount()
      this.getPage(1);
    },
    methods: {
      getPage(pageNumber) {
        this.$store.commit('loading');
        this.$http.get(
          '/article/page', {
            pageNumber: pageNumber,
            pageSize: 4,
            categoryId: this.categoryId
          },
          null
        ).then((response) => {
          this.cards.splice(0, this.cards.length, ...response.data.data);
          // setTimeout(() => {
          //   this.$store.commit('loading');
          // }, 1000)
          this.$store.commit('loading');
        });
      },
      getPageCount() {
        this.$http.get(
          '/article/pageCount', {
            pageNumber: 1,
            pageSize: 4,
            categoryId: this.categoryId
          },
          null
        ).then((response) => {
          this.pageCount = response.data.data;
        });
      },
      getClassifiedArticles(id) {
        this.categoryId = id;
        this.getPageCount();
        this.getPage(1);
      }
    },
    components: {
      BlogCard,
      BlogHeader,
      BlogCategory,
      BlogBar,
      BlogFooter,
      BlogUser,
      BlogTop
    },
  }
</script>