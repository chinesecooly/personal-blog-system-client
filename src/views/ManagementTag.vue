<template>
    <v-card class="mx-auto">
        <v-toolbar color="pink" dark>
            <v-btn icon>
                <v-icon>mdi-tag</v-icon>
            </v-btn>
            <v-toolbar-title>标签管理</v-toolbar-title>
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
                    <v-card-title><span class="text-h5">添加标签</span></v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="12">
                                    <v-text-field label="名称*" required v-model="name" :rules="[v => !!v || '名称不能为空',]">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="grey darken-1" text @click="addd = false">
                            取消
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="add()">
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
                        <v-card-title><span class="text-h5">修改标签</span></v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="12">
                                        <v-text-field label="名称*" required v-model="name"
                                            :rules="[v => !!v || '名称不能为空',]" validate-on-blur>
                                        </v-text-field>
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
                    <v-card-title><span class="text-h5">确定删除所选标签吗？</span></v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="deleted = false">
                            取消
                        </v-btn>
                        <v-btn color="green darken-1" text @click="deleteTag()" :disabled="selected.length==0">
                            确认
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-toolbar>

        <v-list two-line>
            <v-list-item-group v-model="selected" active-class="pink--text" multiple>
                <template v-for="(item, index) in items">
                    <v-list-item :key="item.body">
                        <template v-slot:default="{ active }">
                            <v-list-item-content>
                                <v-list-item-subtitle class="text--primary" v-text="item.body">
                                </v-list-item-subtitle>
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
                deleted: false,
                editord: false,
                name: '',
                disabled: true
            }
        },
        methods: {
            getArticleTag() {
                this.$http.get(
                    '/tag/all',
                    null, null
                ).then((response) => {
                    this.items = response.data.data
                })
            },
            getSelectedItem() {
                let selectedItem = new Array();
                for (; this.selected.length != 0;) {
                    selectedItem.push(this.items[this.selected.pop()])
                }
                return selectedItem;
            },
            add() {
                this.$http.get('/sysArticle/addTag', {
                    body: this.name
                }, {
                    headers: {
                        'token': this.$store.getters.token
                    }
                }).then((result) => {
                    if (result.data.code == 'SUCCESS') {
                        this.$store.commit('successBlogAlter', result.data.msg)
                        this.addd = false;
                    } else {
                        this.$store.commit('failedBlogAlter', result.data.msg)
                    }
                    this.name = '';
                    this.getArticleTag();
                }).catch((err) => {
                    this.$store.commit('warningBlogAlter', '网络异常，请稍后重试')
                });
            },
            deleteTag() {
                this.deleted = false;
                this.$http.post('/sysArticle/removeTag', this.getSelectedItem(), {
                    headers: {
                        'token': this.$store.getters.token
                    }
                }).then((result) => {
                    if (result.data.code == 'SUCCESS') {
                        this.$store.commit('successBlogAlter', result.data.msg)
                    } else {
                        this.$store.commit('failedBlogAlter', result.data.msg)
                    }
                    this.getArticleTag();
                })
            },
            openEditor() {
                if (this.selected.length == 0) {
                    this.name = ''
                    this.disabled = true;
                    this.$store.commit('warningBlogAlter', '请先选择标签')
                } else {
                    this.disabled = false
                    let editorTag = this.items[this.selected.pop()];
                    this.name = editorTag.body;
                    this.id = editorTag.id;
                }
            },
            editor() {
                this.editord = false;
                this.$http.post('/sysArticle/updateTag', {
                    id: this.id,
                    body: this.name
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
                    this.id = null;
                    this.name = '';
                    this.getArticleTag();
                }).catch((err) => {
                    this.$store.commit('warningBlogAlter', '网络异常，请稍后重试')
                });
            }
        },
        mounted() {
            this.getArticleTag();
        }
    }
</script>
<style scoped>

</style>