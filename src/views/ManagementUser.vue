<template>
    <v-card class="mx-auto">
        <v-toolbar color="pink" dark>
            <v-btn icon>
                <v-icon>mdi-account</v-icon>
            </v-btn>
            <v-toolbar-title>用户管理</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-dialog v-model="addd" persistent max-width="500">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" :depressed="true" icon>
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title><span class="text-h5">添加用户</span></v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="12">
                                    <v-text-field label="名称*" required v-model="user.name"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12">
                                    <v-text-field label="邮箱*" required v-model="user.email"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12">
                                    <v-text-field label="密码*" required v-model="user.pwd"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12">
                                    <v-combobox :items="roles" label="角色选择" v-model="roleValue" item-text="name"
                                        clearable>
                                    </v-combobox>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="addd = false">
                            取消
                        </v-btn>
                        <v-btn color="green darken-1" text @click="add()">
                            确认
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="editord" persistent max-width="500">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" :depressed="true" icon @click="openEditor()">
                        <v-icon>mdi-pen</v-icon>
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title><span class="text-h5">编辑用户</span></v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="12">
                                    <v-text-field label="名称*" required v-model="user.name" disabled></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12">
                                    <v-text-field label="邮箱*" required v-model="user.email" disabled></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12">
                                    <v-combobox :items="roles" label="角色选择" v-model="roleValue" item-text="name"
                                        clearable :disabled="disabled">
                                    </v-combobox>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="editord = false;disabled = false">
                            取消
                        </v-btn>
                        <v-btn color="green darken-1" text @click="editor()" :disabled="disabled">
                            确认
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="deleted" persistent max-width="500">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" :depressed="true" icon>
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title><span class="text-h5">确定删除所选用户吗？</span></v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="deleted = false">
                            取消
                        </v-btn>
                        <v-btn color="green darken-1" text @click="deleteUser()" :disabled="selected.length==0">
                            确认
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-toolbar>

        <v-list two-line>
            <v-list-item-group v-model="selected" active-class="pink--text" multiple>
                <v-container height="40">
                    <v-row>
                        <v-col cols="12" lg="3" md="3">名称</v-col>
                        <v-col cols="12" lg="3" md="3">邮箱</v-col>
                        <v-col cols="12" lg="3" md="3">注册时间</v-col>
                        <v-col cols="12" lg="3" md="3">角色</v-col>
                    </v-row>
                </v-container>
                <v-divider></v-divider>
                <template v-for="(item, index) in items">
                    <v-list-item :key="item.body">
                        <template v-slot:default="{ active }">
                            <v-list-item-content>
                                <v-row style="height:50px">
                                    <v-col cols="12" lg="3" md="3" v-text="item.name"></v-col>
                                    <v-col cols="12" lg="3" md="3" v-text="item.email"></v-col>
                                    <v-col cols="12" lg="3" md="3" v-text="item.createTime"></v-col>
                                    <v-col cols="12" lg="3" md="3" v-text="item.role.name"></v-col>
                                </v-row>
                            </v-list-item-content>

                            <v-list-item-action>

                                <v-icon v-if="!active" color="grey lighten-1">
                                    mdi-checkbox-marked-circle
                                </v-icon>

                                <v-icon v-else color="yellow darken-3">
                                    mdi-checkbox-marked-circle
                                </v-icon>
                            </v-list-item-action>
                        </template>
                    </v-list-item>

                    <v-divider v-if="index < items.length - 1" :key="index"></v-divider>
                </template>
            </v-list-item-group>
        </v-list>
    </v-card>
</template>
<script>
    import TagBar from '@/components/TagBar.vue'

    export default {
        components: {
            TagBar
        },
        data() {
            return {
                selected: [],
                items: [],
                editord: false,
                addd: false,
                deleted: false,
                user: {
                    id: null,
                    name: '',
                    email: ''
                },
                roles: [],
                roleValue: null,
                disabled: false
            }
        },
        methods: {
            add() {
                this.editord = false;
                this.$axios({
                    method: 'post',
                    url: '/user/addUserRole',
                    params: {
                        userId: this.user.id
                    },
                    data: this.roleValue,
                    headers: {
                        'token': this.$store.getters.token
                    }
                }).then((response) => {
                    if (response.data.code == "SUCCESS") {
                        this.$store.commit('successBlogAlter', response.data.msg)
                        this.getAllUser()
                    }
                })
            },
            editor() {
                this.editord = false;
                this.$http.post('/user/updateUser', {
                    name: this.user.name,
                    email: this.user.email,
                    role: this.roleValue,
                    id: this.user.id
                }, {
                    headers: {
                        'token': this.$store.getters.token
                    }
                }).then((result) => {
                    if (result.data.code == 'SUCCESS') {
                        this.$store.commit('successBlogAlter', result.data.msg)
                    } else {
                        this.$store.commit('failedBlogAlter', result.data.msg)
                    }
                    this.user.name = '';
                    this.user.email = '';
                    this.roleValue = null;
                    this.id = null;
                    this.getAllUser()
                }).catch((err) => {
                    this.$store.commit('warningBlogAlter', '网络异常，请稍后重试')
                });
            },
            getAllUser() {
                this.$http.get(
                    '/user/allUser',
                    null, {
                        headers: {
                            'token': this.$store.getters.token
                        }
                    }
                ).then((response) => {
                    this.items = response.data.data
                })
            },
            getRole() {
                this.$http.get(
                    '/role/all',
                    null, {
                        headers: {
                            'token': this.$store.getters.token
                        }
                    }
                ).then((response) => {
                    this.roles = response.data.data
                })
            },
            openEditor() {
                if (this.selected.length == 0) {
                    this.user.name = '';
                    this.user.email = '';
                    this.roleValue = null;
                    this.disabled = true;
                    this.user.id = null;
                    this.$store.commit('warningBlogAlter', '请先选择权限')
                } else {
                    this.disabled = false
                    let editorUser = this.items[this.selected.pop()];
                    this.user.name = editorUser.name;
                    this.user.email = editorUser.email;
                    this.roleValue = editorUser.role
                    this.user.id = editorUser.id;
                    console.log(editorUser);
                }
            },
            getSelectedItem() {
                let selectedItem = new Array();
                for (; this.selected.length != 0;) {
                    selectedItem.push(this.items[this.selected.pop()])
                }
                return selectedItem;
            },
            deleteUser() {
                this.deleted = false;
                this.$http.post('/user/removeUser', this.getSelectedItem(), {
                    headers: {
                        'token': this.$store.getters.token
                    }
                }).then((result) => {
                    if (result.data.code == 'SUCCESS') {
                        this.$store.commit('successBlogAlter', result.data.msg)
                    } else {
                        this.$store.commit('failedBlogAlter', result.data.msg)
                    }
                    this.getAllUser()
                })
            }
        },
        mounted() {
            this.getAllUser();
            this.getRole()
        }
    }
</script>
<style scoped>
    .a {
        border-style: dashed;
        border-color: red;
    }
</style>