<template>
    <v-card class="mx-auto">
        <v-toolbar color="pink" dark>
            <v-btn icon>
                <v-icon>mdi-account</v-icon>
            </v-btn>
            <v-toolbar-title>角色管理</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-dialog v-model="addd" persistent max-width="500">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" :depressed="true" icon @click="name = '';
                authorityValue = [];">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title><span class="text-h5">添加角色</span></v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="12">
                                    <v-text-field label="名称*" required v-model="name"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12">
                                    <v-combobox :items="authorities" label="权限选择" multiple v-model="authorityValue"
                                        item-text="description" clearable>
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
                    <v-card>
                        <v-card-title><span class="text-h5">编辑角色</span></v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="12">
                                        <v-text-field label="名称*" required v-model="name"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12">
                                        <v-combobox :items="authorities" label="权限选择" multiple v-model="authorityValue"
                                            item-text="description" clearable>
                                        </v-combobox>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="grey darken-1" text @click="editord = false">
                                取消
                            </v-btn>
                            <v-btn color="blue darken-1" text @click="editor()" :disabled="disabled">
                                确认
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-card>
            </v-dialog>
            <v-dialog v-model="deleted" persistent max-width="500">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" :depressed="true" icon>
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title><span class="text-h5">确定删除所选角色吗？</span></v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="deleted = false">
                            取消
                        </v-btn>
                        <v-btn color="green darken-1" text @click="deleteRole()" :disabled="selected.length==0">
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
                        <v-col cols="12" lg="6" md="6">名称</v-col>
                        <v-col cols="12" lg="6" md="6">权限列表</v-col>
                    </v-row>
                </v-container>
                <v-divider></v-divider>
                <template v-for="(item, index) in items">
                    <v-list-item :key="item.name">
                        <template v-slot:default="{ active }">
                            <v-list-item-content>
                                <v-row style="height:50px">
                                    <v-col cols="12" lg="6" md="6" v-text="item.name">名称</v-col>
                                    <v-col cols="12" lg="6" md="6">
                                        <v-menu offset-y open-on-hover>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn v-bind="attrs" v-on="on" color="blue" text>
                                                    悬停查看权限列表
                                                </v-btn>
                                            </template>
                                            <v-list disabled>
                                                <v-list-item v-for="(authority, index) in item.authorities"
                                                    :key="index">
                                                    <v-list-item-title>
                                                        {{ authority==null?null:authority.description}}
                                                    </v-list-item-title>
                                                    <v-divider></v-divider>
                                                </v-list-item>
                                            </v-list>
                                        </v-menu>
                                    </v-col>
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
                id: '',
                name: '',
                authorities: [],
                authorityValue: [],
                disabled: true
            }
        },
        methods: {
            getRole() {
                this.$http.get(
                    '/role/all',
                    null, {
                        headers: {
                            'token': this.$store.getters.token
                        }
                    }
                ).then((response) => {
                    this.items = response.data.data
                })
            },
            editor() {
                this.editord = false;
                this.$http.post('/role/updateRole', {
                    id: this.id,
                    name: this.name,
                    authorities: this.authorityValue
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
                    this.id = '';
                    this.name = '';
                    this.authorityValue = [];
                    this.getRole()
                }).catch((err) => {
                    this.$store.commit('warningBlogAlter', '网络异常，请稍后重试')
                });
            },
            getAuthority() {
                this.$http.get(
                    '/authority/all',
                    null, {
                        headers: {
                            'token': this.$store.getters.token
                        }
                    }
                ).then((response) => {
                    this.authorities = response.data.data
                })
            },
            add() {
                this.addd = false;
                this.$http.post('/role/add', {
                    name: this.name,
                    authorities: this.authorityValue
                }, {
                    headers: {
                        'token': this.$store.getters.token
                    }
                }).then((response) => {
                    if (response.data.code == "SUCCESS") {
                        this.$store.commit('successBlogAlter', response.data.msg)
                        this.name = '';
                        this.authorityValue = [];
                        this.getRole();
                    }
                })
            },
            openEditor() {
                if (this.selected.length == 0) {
                    this.name = '';
                    this.authorityValue = [];
                    this.disabled = true;
                    this.$store.commit('warningBlogAlter', '请先选择角色')
                } else {
                    this.disabled = false
                    let editorRole = this.items[this.selected.pop()];
                    this.name = editorRole.name;
                    this.authorityValue = editorRole.authorities;
                    this.id = editorRole.id;
                }
            },
            getSelectedItem() {
                let selectedItem = new Array();
                for (; this.selected.length != 0;) {
                    selectedItem.push(this.items[this.selected.pop()])
                }
                return selectedItem;
            },
            deleteRole() {
                this.deleted = false;
                this.$http.post('/role/removeRole', this.getSelectedItem(), {
                    headers: {
                        'token': this.$store.getters.token
                    }
                }).then((result) => {
                    if (result.data.code == 'SUCCESS') {
                        this.$store.commit('successBlogAlter', result.data.msg)
                    } else {
                        this.$store.commit('failedBlogAlter', result.data.msg)
                    }
                    this.getRole()
                })
            }
        },
        mounted() {
            this.getRole();
            this.getAuthority();
        }
    }
</script>
<style scoped>
    .a {
        border-style: dashed;
        border-color: red;
    }
</style>