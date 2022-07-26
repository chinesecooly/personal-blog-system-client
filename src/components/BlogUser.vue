<template>
    <v-container id="create">
        <v-speed-dial v-model="fab" bottom right transition="slide-y-reverse-transition">
            <template v-slot:activator>
                <v-btn v-model="fab" dark fab>
                    <v-icon v-if="fab">
                        mdi-close
                    </v-icon>
                    <v-avatar v-else-if="!fab&&($store.getters.user!=null)" size="65" class="mb-2">
                        <blog-avatar :selected="false" ref="avatar"></blog-avatar>
                    </v-avatar>
                    <v-icon v-else>
                        mdi-account-alert
                    </v-icon>
                </v-btn>
            </template>
            <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn fab dark small color="green" v-bind="attrs" v-on="on" @click="$refs.login.activeLogin=true">
                        <v-icon>mdi-login</v-icon>
                    </v-btn>
                </template>
                <span>登录</span>
            </v-tooltip>

            <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn fab dark small color="red" v-bind="attrs" v-on="on" @click="logout()">
                        <v-icon>mdi-logout</v-icon>
                    </v-btn>
                </template>
                <span>注销</span>
            </v-tooltip>

            <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn fab dark small color="indigo" v-bind="attrs" v-on="on"
                        @click="$refs.register.activeRegister=true">
                        <v-icon>mdi-door</v-icon>
                    </v-btn>
                </template>
                <span>注册</span>
            </v-tooltip>
        </v-speed-dial>

        <v-row justify="center">
            <blog-login ref="login" @login="getAvatarByUserId()"></blog-login>
        </v-row>
        <v-row justify="center">
            <blog-register ref="register"></blog-register>
        </v-row>
    </v-container>
</template>

<script>
    import Avataaars from 'vuejs-avataaars'
    import BlogRegister from '@/components/BlogRegister.vue';
    import BlogLogin from '@/components/BlogLogin.vue';
    import BlogAvatar from './BlogAvatar.vue';
    export default {
        data: () => ({
            fab: false
        }),
        components: {
            Avataaars,
            BlogRegister,
            BlogLogin,
            BlogAvatar
        },
        methods: {
            logout() {
                if (this.$store.getters.user == null) {
                    this.$store.commit("warningBlogAlter", '尚未登录，请先登录')
                } else {
                    this.$http.get(
                        '/user/logout',
                        null, {
                            headers: {
                                'token': this.$store.getters.token
                            }
                        }
                    ).then((response) => {
                        if (response.data.code == 'SUCCESS') {
                            this.$store.commit('user', null);
                            this.$store.commit('token', null);
                            this.$store.commit("successBlogAlter", response.data.msg)
                        } else {
                            this.$store.commit('user', null)
                            this.$store.commit('token', '')
                            this.$store.commit("warningBlogAlter", response.data.msg)
                        }
                    })
                }
            },
            getAvatarByUserId() {
                this.$refs.avatar.getAvatarByUserId(this.$store.getters.user.id)
            }
        }
    }
</script>

<style scoped>
    #create .v-speed-dial {
        position: absolute;
    }

    #create .v-btn--floating {
        position: relative;
    }

    .position-relative {
        position: relative;
    }

    #create {
        position: fixed;
        bottom: 60px;
        right: 0%;
        z-index: 1;
        width: 55px;
        height: 55px;

    }
</style>