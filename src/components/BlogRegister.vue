<template>
    <v-dialog v-model="activeRegister" persistent max-width="600px">
        <v-stepper v-model="e1">
            <v-stepper-header>
                <v-stepper-step :complete="e1 > 1" step="1">
                    自定义头像
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="e1 > 2" step="2">
                    用户名和邮箱
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step step="3">
                    密码和密码确认
                </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1">
                    <blog-avatar></blog-avatar>
                    <v-btn color="primary" @click="e1 = 2" text>
                        继续
                    </v-btn>

                    <v-btn text @click="activeRegister=false">
                        取消
                    </v-btn>
                </v-stepper-content>

                <v-stepper-content step="2">
                    <v-col cols="12">
                        <v-text-field label="用户名*" required v-model="name"></v-text-field>
                    </v-col>
                    <v-col cols="12" style="position:relative">
                        <v-text-field label="邮箱*" required v-model="email"></v-text-field>
                        <v-btn text absolute right bottom class="mb-5" @click="generateAuthCode()">获取邮箱验证码
                        </v-btn>
                    </v-col>
                    <v-col cols="12">
                        <div class="ma-auto position-relative" style="max-width: 300px">
                            <v-otp-input v-model="otp" :disabled="verifyAuthCodeLoading" @finish="onFinish()"
                                length="5">
                            </v-otp-input>
                            <v-overlay absolute :value="verifyAuthCodeLoading">
                                <v-progress-circular indeterminate color="primary">
                                </v-progress-circular>
                            </v-overlay>
                        </div>
                    </v-col>
                    <v-btn color="primary" @click="e1 = 3" text>
                        继续
                    </v-btn>

                    <v-btn text @click="activeRegister=false">
                        取消
                    </v-btn>
                </v-stepper-content>

                <v-stepper-content step="3">
                    <v-col cols="12">
                        <v-text-field label="密码*" type="password" required v-model="pwd"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field label="确认密码*" type="password" required v-model="rePwd"></v-text-field>
                    </v-col>
                    <v-row>
                        <v-col cols="12">
                            <v-btn color="primary" @click="e1 = 1" text>
                                继续
                            </v-btn>

                            <v-btn text @click="activeRegister=false">
                                取消
                            </v-btn>

                            <v-btn text @click="register()" :loading="loading" light>
                                注册
                            </v-btn>
                        </v-col>

                    </v-row>

                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </v-dialog>
</template>

<script>
    import BlogAvatar from '@/components/BlogAvatar.vue';
    export default {
        data: () => ({
            e1: 1,
            name: '',
            pwd: '',
            rePwd: '',
            email: '',
            activeRegister: false,
            loading: false,
            verifyAuthCodeLoading: false,
            otp: '',
        }),
        components: {
            BlogAvatar
        },
        methods: {
            register() {
                this.loading = true;
                this.$axios({
                    method: 'post',
                    url: '/user/register',
                    data: {
                        name: this.name,
                        pwd: this.pwd,
                        email: this.email
                    }
                }).then((response) => {
                    this.loading = false;
                    if (response.data.code == 'SUCCESS') {
                        this.activeRegister = false;
                        this.$store.commit("successBlogAlter", response.data.msg)
                    }
                    this.$store.commit("failedBlogAlter", response.data.msg)
                })
            },
            onFinish() {
                this.verifyAuthCodeLoading = true
                this.$http.get(
                    '/user/verifyAuthCode', {
                        username: this.name,
                        authCode: this.otp
                    },
                    null
                ).then((response) => {
                    if (response.data.code == 'SUCCESS') {
                        this.verifyAuthCodeLoading = false;
                    } else {
                        this.verifyAuthCodeLoading = false;
                        this.$store.commit("failedBlogAlter", response.data.msg)
                        this.otp = '';
                    }
                })
            },
            generateAuthCode() {
                this.$axios({
                    method: 'post',
                    url: '/user/generateAuthCode',
                    data: {
                        name: this.name,
                        email: this.email
                    }
                })
            }

        }
    }
</script>