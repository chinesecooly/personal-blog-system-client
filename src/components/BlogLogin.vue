<template>
    <v-row justify="center">
        <v-dialog v-model="activeLogin" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="text-h5">登录</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="用户名*" required v-model="name"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="密码*" type="password" required v-model="pwd"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="activeLogin=false">
                        取消
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="login()" :loading="loading">
                        登录
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
    export default {
        data: () => ({
            name: '',
            pwd: '',
            fab: false,
            activeLogin: false,
            loading: false,
        }),
        methods: {
            login() {
                this.loading = true;
                this.$axios({
                    method: 'post',
                    url: '/user/login',
                    data: {
                        name: this.name,
                        pwd: this.pwd
                    }
                }).then((response) => {
                    this.loading = false;
                    if (response.data.code == 'SUCCESS') {
                        this.$store.commit('token', response.data.data);
                        this.$http.get(
                            '/user/getUserByName', {
                                name: this.name
                            }, {
                                headers: {
                                    'token': this.$store.getters.token
                                }
                            }
                        ).then((response) => {
                            if (response.data.code == 'SUCCESS') {
                                this.activeLogin = false;
                                this.$store.commit('user', response.data.data);
                                this.$store.commit("successBlogAlter", '登陆成功')
                            } else {
                                this.$store.commit("failedBlogAlter", '登陆失败')
                            }
                        })
                    } else {
                        this.$store.commit("failedBlogAlter", response.data.msg)
                    }
                })
            }
        }
    }
</script>