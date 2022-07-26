<template>
    <v-row justify="center">
        <v-dialog v-model="activeLogin" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="text-h5">登录</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="form2" v-model="valid">
                        <v-text-field v-model="name" :rules="[v => !!v || '用户名不能为空',]" label="用户名" required>
                        </v-text-field>
                        <v-text-field v-model="pwd" :rules="[v => !!v || '密码不能为空',]" label="密码" required
                            type="password">
                        </v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-dialog v-model="editord" persistent max-width="500">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" text color="primary" plain>
                                忘记密码?
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title><span class="text-h5">修改密码</span></v-card-title>
                            <v-card-text>
                                <v-form ref="form" v-model="valid" style="position:relative">
                                    <v-text-field v-model="name" :rules="nameRules" label="用户名" required>
                                    </v-text-field>
                                    <v-text-field v-model="email" :rules="emailRules" label="邮箱" required>
                                    </v-text-field>
                                    <v-btn text absolute right bottom class="mb-2 mr-n3" @click="generateAuthCode()"
                                        :disabled="!valid" :loading="loading" v-if="!isTimeDown">获取邮箱验证码
                                    </v-btn>
                                    <v-btn absolute right bottom class="mb-2 mr-n3" :disabled="true" v-else text>
                                        {{time}}后可重新发送验证码
                                    </v-btn>
                                    <v-col cols="12">
                                        <div class="ma-auto position-relative" style="max-width: 300px">
                                            <v-otp-input v-model="otp" :disabled="verifyAuthCodeLoading"
                                                @finish="onFinish()" length="5">
                                            </v-otp-input>
                                            <v-overlay absolute :value="verifyAuthCodeLoading">
                                                <v-progress-circular indeterminate color="primary">
                                                </v-progress-circular>
                                            </v-overlay>
                                        </div>
                                    </v-col>
                                    <v-text-field v-model="pwd" :rules="pwdRules" label="新密码" required type="password">
                                    </v-text-field>
                                    <v-text-field v-model="rePwd" :rules="rePwdRules" label="确认密码" required
                                        type="password">
                                    </v-text-field>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="editord = false">
                                    取消
                                </v-btn>
                                <v-btn color="blue darken-1" text @click="editor()" :disabled="!valid">
                                    确认
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="activeLogin=false">
                        取消
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="login()" :loading="loading" :disabled="!valid">
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
            editord: false,
            name: '',
            pwd: '',
            fab: false,
            activeLogin: false,
            loading: false,
            valid: true,
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
            verifyAuthCodeLoading: false,
            otp: '',
            authCodeValid: false,
            time: 30,
            timeId: null
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
                            }
                        ).then((response) => {
                            if (response.data.code == 'SUCCESS') {
                                this.activeLogin = false;
                                this.$store.commit('user', response.data.data);
                                this.$emit('login');
                                this.$refs.form2.reset();
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