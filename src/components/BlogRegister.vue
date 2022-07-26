<template>
    <v-dialog v-model="activeRegister" persistent max-width="600px">
        <v-stepper v-model="el">
            <v-stepper-header>
                <v-stepper-step :complete="el > 1" step="1">
                    自定义头像
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="el > 2" step="2">
                    用户名和邮箱
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step step="3">
                    密码和密码确认
                </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1">
                    <blog-avatar ref="avatar"></blog-avatar>
                    <v-btn text @click="activeRegister=false">
                        取消
                    </v-btn>
                    <v-btn color="primary" @click="el = 2" text>
                        下一步
                    </v-btn>
                </v-stepper-content>

                <v-stepper-content step="2">
                    <v-form ref="form1" v-model="valid1" style="position:relative">
                        <v-text-field v-model="name" :counter="10" :rules="nameRules" label="用户名" required>
                        </v-text-field>
                        <v-text-field v-model="email" :rules="emailRules" label="邮箱" required>
                        </v-text-field>
                        <v-btn text absolute right bottom class="mb-2 mr-n3" @click="generateAuthCode()"
                            :disabled="!valid1" :loading="loading" v-if="!isTimeDown">获取邮箱验证码
                        </v-btn>
                        <v-btn absolute right bottom class="mb-2 mr-n3" :disabled="true" v-else text>
                            {{time}}后可重新发送验证码
                        </v-btn>
                    </v-form>
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
                    <v-btn text @click="activeRegister=false">
                        取消
                    </v-btn>
                    <v-btn color="primary" @click="el= 1" text>
                        上一步
                    </v-btn>
                    <v-btn color="primary" @click="validateForm1()" text :disabled="!valid1">
                        下一步
                    </v-btn>
                </v-stepper-content>

                <v-stepper-content step="3">
                    <v-form ref="form2" v-model="valid2">
                        <v-text-field v-model="pwd" :rules="pwdRules" label="密码" required type="password">
                        </v-text-field>
                        <v-text-field v-model="rePwd" :rules="rePwdRules" label="确认密码" required type="password">
                        </v-text-field>
                    </v-form>
                    <v-row>
                        <v-col cols="12">
                            <v-btn text @click="activeRegister=false">
                                取消
                            </v-btn>
                            <v-btn color="primary" @click="el = 2" text>
                                上一步
                            </v-btn>

                            <v-btn text @click="register()" :loading="loading" light color="primary"
                                :disabled="!valid2">
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
            valid1: true,
            valid2: true,
            el: 1,
            isTimeDown: false,
            name: '',
            nameRules: [
                v => !!v || '用户名不能为空',
                v => (v && v.length <= 10) || '用户名不能超过十个字符',
            ],
            pwd: '',
            pwdRules: [
                v => !!v || '密码不能为空',
                v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&*+-]).{8,}$/.test(v) ||
                '密码必须包含数字特殊符号(~!@#$%^&*+-)和大小写字母',
            ],
            rePwd: '',
            rePwdRules: [
                v => !!v || '确认密码不能为空',
            ],
            email: '',
            emailRules: [
                v => !!v || '邮箱不能为空',
                v => /.+@.+\..+/.test(v) || '邮箱无效',
            ],
            activeRegister: false,
            loading: false,
            verifyAuthCodeLoading: false,
            otp: '',
            authCodeValid: false,
            time: 30,
            timeId: null
        }),
        components: {
            BlogAvatar
        },
        methods: {
            register() {
                if (this.rePwd != this.pwd) {
                    this.$store.commit('warningBlogAlter', '两次密码不一致')
                } else {
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
                            this.$refs.avatar.saveAvatar(response.data.data);
                            this.activeRegister = false;
                            this.isTimeDown = true;
                            this.$refs.form1.reset();
                            this.$refs.form2.reset();
                            this.otp = '';
                            this.el = 1;
                            this.$store.commit("successBlogAlter", response.data.msg)
                        }
                        this.$store.commit("failedBlogAlter", response.data.msg)
                    })
                }
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
                        this.authCodeValid = true;
                    } else {
                        this.verifyAuthCodeLoading = false;
                        this.$store.commit("failedBlogAlter", response.data.msg)
                        this.otp = '';
                    }
                })
            },
            generateAuthCode() {
                this.otp = '';
                if (this.$refs.form1.validate() == true) {
                    this.loading = true;
                    this.$axios({
                        method: 'post',
                        url: '/user/generateAuthCode',
                        data: {
                            name: this.name,
                            email: this.email
                        }
                    }).then((result) => {
                        if (result.data.code == 'SUCCESS') {
                            this.loading = false;
                            this.isTimeDown = true;
                            this.timeId = setInterval(this.timeDown, 1000);
                        }
                    }).catch((err) => {
                        this.$store.commit('warningBlogAlter', '网络超时，请稍后重试')
                    });
                }
            },
            validateForm1() {
                if (this.$refs.form1.validate() == true) {
                    this.$http.get('/user/getUserByName', {
                        name: this.name
                    }, null).then((result) => {
                        console.log(result.data.data);
                        if (result.data.data != null) {
                            this.$store.commit('warningBlogAlter', '用户已存在')
                        } else {
                            if (this.authCodeValid == false) {
                                this.$store.commit('warningBlogAlter', '请先验证邮箱')
                            } else {
                                this.el = 3
                            }
                        }
                    }).catch((err) => {
                        return false
                    });
                }
            },
            timeDown() {
                if (this.time > 0) {
                    this.time--;
                } else {
                    this.isTimeDown = false;
                    clearInterval(this.timeId);
                }
            }
        },
        watch: {
            email() {
                this.authCodeValid = false
            }
        }
    }
</script>