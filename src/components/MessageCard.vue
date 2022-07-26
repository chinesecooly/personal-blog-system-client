<template>
  <v-container>
    <v-card class="mx-auto" :color="colors[Math.floor(Math.random() * 4)]" dark max-width="400">
      <v-card-title>
        <v-avatar>
          <avataaars></avataaars>
        </v-avatar>
        <span class="text-h6 font-weight-light">
          {{user.name}}
        </span>
      </v-card-title>

      <v-card-text class="text-h5 font-weight-bold ml-2">
        {{message.body}}
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
  import Avataaars from 'vuejs-avataaars'
  export default {
    props: {
      message: null,
    },
    data: () => ({
      deld: false,
      user: '',
      colors: ['cyan', 'green', 'pink', 'amber', 'orange']
    }),
    methods: {
      del() {
        this.deld = -1;
      },
      getUser() {
        this.$http.get('/user/getUserById', {
            id: this.message.userId,
          },
          null
        ).then((response) => {
          this.user = response.data.data
        })
      }
    },
    components: {
      Avataaars
    },
    mounted() {
      this.getUser()
    }
  }
</script>