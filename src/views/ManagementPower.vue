<template>
    <v-card class="mx-auto">
        <v-toolbar color="pink" dark>
            <v-btn icon>
                <v-icon>mdi-account</v-icon>
            </v-btn>
            <v-toolbar-title>权限管理</v-toolbar-title>
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
                    <v-card-title><span class="text-h5">添加权限</span></v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="12">
                                    <v-text-field label="名称*" required v-model="name"></v-text-field>
                                    <v-text-field label="路径*" required v-model="url"></v-text-field>
                                    <v-text-field label="说明*" required v-model="description"></v-text-field>
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
                        <v-card-title><span class="text-h5">修改权限</span></v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="12">
                                        <v-text-field label="名称*" required v-model="name"
                                            :rules="[v => !!v || '名称不能为空',]"></v-text-field>
                                        <v-text-field label="路径*" required v-model="url"
                                            :rules="[v => !!v || '路径不能为空',]"></v-text-field>
                                        <v-text-field label="说明*" required v-model="description"
                                            :rules="[v => !!v || '描述不能为空',]"></v-text-field>
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
                    <v-card-title><span class="text-h5">确定删除所选权限吗？</span></v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="deleted = false">
                            取消
                        </v-btn>
                        <v-btn color="green darken-1" text @click="deleteAuthority()" :disabled="selected.length==0">
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
                        <v-col cols="12" lg="3" md="3">ID</v-col>
                        <v-col cols="12" lg="3" md="3">名称</v-col>
                        <v-col cols="12" lg="3" md="3">路径</v-col>
                        <v-col cols="12" lg="3" md="3">描述</v-col>
                    </v-row>
                </v-container>
                <v-divider></v-divider>
                <template v-for="(item, index) in items">
                    <v-list-item :key="item.body">
                        <template v-slot:default="{ active }">
                            <v-list-item-content>
                                <v-row style="height:50px">
                                    <v-col cols="12" lg="3" md="3" v-text="item.id"></v-col>
                                    <v-col cols="12" lg="3" md="3" v-text="item.name"></v-col>
                                    <v-col cols="12" lg="3" md="3" v-text="item.path"></v-col>
                                    <v-col cols="12" lg="3" md="3" v-text="item.description"></v-col>
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
                id: '',
                selected: [],
                items: [],
                addd: false,
                editord: false,
                deleted: false,
                name: '',
                url: '',
                description: '',
                disabled: true
            }
        },
        methods: {
            getAuthority() {
                this.$http.get(
                    '/authority/all',
                    null, {
                        headers: {
                            'token': this.$store.getters.token
                        }
                    }
                ).then((response) => {
                    this.items = response.data.data
                })
            },
            add() {
                this.addd = false;
                this.$http.post('/authority/add', {
                    name: this.name,
                    path: this.url,
                    description: this.description
                }, {
                    headers: {
                        'token': this.$store.getters.token
                    }
                }).then((response) => {
                    if (response.data.code == "SUCCESS") {
                        this.$store.commit('successBlogAlter', response.data.msg)
                        this.name = '';
                        this.url = '';
                        this.description = '';
                        this.getAuthority()
                    }
                })
            },
            deleteAuthority() {
                this.deleted = false;
                this.$http.post('/authority/removeAuthority', this.getSelectedItem(), {
                    headers: {
                        'token': this.$store.getters.token
                    }
                }).then((result) => {
                    if (result.data.code == 'SUCCESS') {
                        this.$store.commit('successBlogAlter', result.data.msg)
                    } else {
                        this.$store.commit('failedBlogAlter', result.data.msg)
                    }
                    this.getAuthority()
                })
            },
            openEditor() {
                if (this.selected.length == 0) {
                    this.name = '';
                    this.url = '';
                    this.description = '';
                    this.disabled = true;
                    this.$store.commit('warningBlogAlter', '请先选择权限')
                } else {
                    this.disabled = false
                    let editorAuthority = this.items[this.selected.pop()];
                    this.name = editorAuthority.name;
                    this.url = editorAuthority.path;
                    this.description = editorAuthority.description;
                    this.id = editorAuthority.id;
                }
            },
            editor() {
                this.editord = false;
                this.$http.post('/authority/updateAuthority', {
                    id: this.id,
                    name: this.name,
                    path: this.url,
                    description: this.description
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
                    this.name = '';
                    this.url = '';
                    this.description = '';
                    this.getAuthority()
                }).catch((err) => {
                    this.$store.commit('warningBlogAlter', '网络异常，请稍后重试')
                });
            },
            getSelectedItem() {
                let selectedItem = new Array();
                for (; this.selected.length != 0;) {
                    selectedItem.push(this.items[this.selected.pop()])
                }
                return selectedItem;
            },
        },
        mounted() {
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