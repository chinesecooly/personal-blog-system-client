<template>
    <v-container>
        <v-navigation-drawer v-model="drawer" app dark width="200">
            <v-list nav class="mr-n1">
                <v-list-item-group v-model="group" active-class="deep-grey--text text--accent-5">
                    <v-list-item to="/home">
                        <v-list-item-icon>
                            <v-icon>mdi-home</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>首页</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item to="/management/managementContent">
                        <v-list-item-icon>
                            <v-icon>mdi-pen</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>文章管理</v-list-item-title>
                    </v-list-item>

                    <v-list-item to="/management/managementCategory">
                        <v-list-item-icon>
                            <v-icon>mdi-book</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>专栏管理</v-list-item-title>
                    </v-list-item>

                    <v-list-item to="/management/managementComment">
                        <v-list-item-icon>
                            <v-icon>mdi-comment</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>评论管理</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/management/managementMessage">
                        <v-list-item-icon>
                            <v-icon>mdi-message</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>留言管理</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/management/managementTag">
                        <v-list-item-icon>
                            <v-icon>mdi-tag</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>标签管理</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/management/managementPower">
                        <v-list-item-icon>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>权限管理</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/management/managementRole">
                        <v-list-item-icon>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>角色管理</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/management/managementUser">
                        <v-list-item-icon>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>用户管理</v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app dark>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>个人博客后台管理系统</v-toolbar-title>
        </v-app-bar>
        <v-progress-linear :active="$store.getters.loading" :indeterminate="$store.getters.loading" absolute bottom
            color="deep-purple accent-4">
        </v-progress-linear>
        <router-view></router-view>
    </v-container>
</template>

<script>
    export default {
        data: () => ({
            drawer: true,
            group: null,
        }),
        watch: {
            group() {
                this.drawer = false
            },
        },
    }
</script>
<style scoped>
    #a {
        border-style: dashed;
    }
</style>