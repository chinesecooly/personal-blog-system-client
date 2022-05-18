<template>
    <v-container>
        <v-app-bar fixed elevation="8" class=" mt-3" dark height="50">
            <v-btn height="50px" text color="yellow">肉人的博客</v-btn>
            <v-btn v-for="(link,index) in links" :key="index" :to="link[1]" height="50px" min-width="100px" text>
                {{link[0]}}
            </v-btn>
            <v-spacer></v-spacer>
            <blog-find></blog-find>
            <v-btn rounded class=" mt-0.5 ml-10" icon>
                <v-icon>mdi-bell</v-icon>
            </v-btn>
            <v-progress-linear :active="$store.getters.loading" :indeterminate="$store.getters.loading" absolute bottom
                color="deep-purple accent-4">
            </v-progress-linear>
        </v-app-bar>
        <v-img src="../assets/imgs/loading.png" class="mt-10"></v-img>
        <blog-user></blog-user>
    </v-container>
</template>

<script>
    import BlogFind from "@/components/BlogFind.vue";
    import BlogUser from '@/components/BlogUser.vue';
    export default {
        components: {
            BlogUser,
            BlogFind
        },
        data: () => ({
            links: [
                ['首页', '/home'],
                ['聊天室', '/chatRoom'],
                ['留言板', '/messageBoard'],
                ['实验室', '/lab']
            ],
        })

    }
</script>