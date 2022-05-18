<template>
    <v-app-bar fixed elevation="8" class=" mt-3" :class="color" :dark="dark" height="50">
        <v-btn height="50px" text color="yellow">肉人的博客</v-btn>
        <v-btn v-for="(link,index) in links" :key="index" :to="link[1]" height="50px" min-width="100px" text>
            {{link[0]}}
        </v-btn>
        <v-spacer></v-spacer>
        <blog-find></blog-find>

        <v-btn rounded class=" mt-0.5 ml-10" icon>
            <v-icon>mdi-bell</v-icon>
        </v-btn>
        <v-btn rounded color="red" class=" mt-0.5 ml-10" to="/editor">
            <v-icon small>mdi-feather</v-icon>
            发布文章
        </v-btn>
        <v-btn rounded color="red" class=" mt-0.5 ml-10" to="/management">
            <v-icon small>mdi-cog</v-icon>
            文章管理
        </v-btn>
        <v-progress-linear :active="$store.getters.loading" :indeterminate="$store.getters.loading" absolute bottom
            color="deep-purple accent-4">
        </v-progress-linear>
    </v-app-bar>

</template>

<script>
    import BlogFind from "./BlogFind.vue";
    export default {
        data: () => ({
            links: [
                ['首页', '/home'],
                ['聊天室', '/chatRoom'],
                ['留言板', '/messageBoard'],
                ['实验室', '/lab']
            ],
            dark: false,
            color: {
                transparent: true
            }
        }),
        components: {

            BlogFind,
        },
        mounted() {
            let scroll = document.scrollingElement
            document.addEventListener('scroll', () => {
                if (scroll.scrollTop >= scroll.scrollHeight / 5) {
                    this.dark = true
                    this.color.transparent = false
                } else {
                    this.dark = false
                    this.color.transparent = true
                }
            })
        }
    }
</script>
<style scoped>
    .transparent {
        color: transparent;
    }
</style>