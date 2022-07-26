<template>
    <v-container class="mt-n2">
        <v-card>
            <v-tabs v-model="tab" fixed-tabs>
                <v-tab v-for="item,index in items" :key="item.tab" @click="tabChange(index)">
                    {{ item.tab }}
                </v-tab>
            </v-tabs>
            <v-toolbar height="50">
                <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date"
                    transition="scale-transition" offset-y max-width="290px" min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="date" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                            class="mt-5"></v-text-field>
                    </template>
                    <v-date-picker v-model="date" type="month" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false">
                            取消
                        </v-btn>
                        <v-btn text color="primary" @click="$refs.menu.save(date)">
                            确认
                        </v-btn>
                    </v-date-picker>
                </v-menu>
                <v-text-field hide-details prepend-icon="mdi-magnify" single-line></v-text-field>
            </v-toolbar>
            <v-tabs-items v-model="tab">
                <v-tab-item v-for="item in items" :key="item.tab">
                    <v-card v-for="article,index in item.content" :key="index" outlined>
                        <v-card-title>
                            {{article.title}}
                        </v-card-title>
                        <v-card-subtitle class="red--text lighten-1" v-if="!article.isDraft&&!article.isDeleted">
                            已发布
                        </v-card-subtitle>
                        <v-card-subtitle class="grey--text lighten-1" v-if="article.isDraft&&!article.isDeleted">
                            草稿
                        </v-card-subtitle>
                        <v-card-actions>
                            <v-btn text>
                                <v-icon>mdi-eye</v-icon>
                                {{article.readCount}}
                            </v-btn>
                            <v-btn text>
                                <v-icon>mdi-thumb-up</v-icon>
                                {{article.likeCount}}
                            </v-btn>

                            <v-btn text>
                                <v-icon>mdi-star-box</v-icon>
                                {{article.favoriteCount}}
                            </v-btn>
                            <v-btn text>
                                <v-icon>mdi-comment</v-icon>
                                {{article.commentCount}}
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn text v-if="!article.isDeleted" :to="'/managementEditor/'+article.id">
                                <v-icon>mdi-pen</v-icon>
                                编辑
                            </v-btn>
                            <v-btn text @click="recoverArticle(article.id)" v-if="article.isDeleted">
                                <v-icon>mdi-refresh</v-icon>
                                恢复
                            </v-btn>
                            <v-btn text color="red" @click="thoroughDeleteArticle(article.id)" v-if="article.isDeleted">
                                <v-icon>mdi-delete</v-icon>
                                彻底删除
                            </v-btn>
                            <v-btn text color="red" @click="deleteArticle(article.id)" v-if="!article.isDeleted">
                                <v-icon>mdi-delete</v-icon>
                                删除
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </v-card>
    </v-container>
</template>
<script>
    export default {
        data() {
            return {
                tab: null,
                date: new Date().toISOString().substr(0, 7),
                menu: false,
                modal: false,
                items: [{
                        tab: '全部',
                        content: []
                    },
                    {
                        tab: '全部可见',
                        content: []
                    },
                    {
                        tab: '草稿箱',
                        content: []
                    },
                    {
                        tab: '回收站',
                        content: []
                    }
                ],
            }
        },
        methods: {
            tabChange(index) {
                switch (index) {
                    case 0:
                        this.sysALL()
                        break;
                    case 1:
                        this.sysArticle()
                        break;
                    case 2:
                        this.sysDraft()
                        break;
                    case 3:
                        this.sysRecycle()
                        break;
                    default:
                        break;
                }
            },
            sysALL() {
                this.$http.get(
                    '/article/sysAll',
                    null, null
                ).then((response) => {
                    this.items[0].content = response.data.data;
                })
            },
            sysArticle() {
                this.$http.get(
                    '/article/sysArticle',
                    null, null
                ).then((response) => {
                    this.items[1].content = response.data.data;
                })
            },
            sysDraft() {
                this.$http.get(
                    '/article/sysDraft',
                    null, null
                ).then((response) => {
                    this.items[2].content = response.data.data;
                })
            },
            sysRecycle() {
                this.$http.get(
                    '/article/sysRecycle',
                    null, null
                ).then((response) => {
                    this.items[3].content = response.data.data;
                })
            },
            editorArticle(id) {

            },
            deleteArticle(id) {
                if (this.$store.getters.user == null) {
                    this.$store.commit("failedBlogAlter", '尚未登陆,请先登录')
                    return;
                }
                this.$http.get(
                    '/sysArticle/sysDeleteById', {
                        id: id
                    }, {
                        headers: {
                            'token': this.$store.getters.token
                        }
                    }
                ).then((response) => {
                    if (response.data.code == "SUCCESS") {
                        this.$store.commit("successBlogAlter", response.data.msg)
                        this.sysALL()
                        this.sysArticle()
                        this.sysDraft()
                        this.sysRecycle()
                    } else {
                        this.$store.commit("failedBlogAlter", response.data.msg)
                        if (response.data.code == "LOGIN_TIMEOUT") {
                            this.$store.commit("user", null);
                            this.$store.commit("token", '');
                            console.log('user', this.$store.getters.user);
                        }
                    }
                })
            },
            recoverArticle(id) {
                if (this.$store.getters.user == null) {
                    this.$store.commit("failedBlogAlter", '尚未登陆,请先登录')
                    return;
                }
                this
                this.$http.get(
                    '/sysArticle/recoverArticleById', {
                        id: id
                    }, {
                        headers: {
                            'token': this.$store.getters.token
                        }
                    }
                ).then((response) => {
                    if (response.data.code == "SUCCESS") {
                        this.$store.commit("successBlogAlter", response.data.msg)
                        this.sysALL()
                        this.sysArticle()
                        this.sysDraft()
                        this.sysRecycle()
                    } else {
                        this.$store.commit("failedBlogAlter", response.data.msg)
                        if (response.data.code == "LOGIN_TIMEOUT") {
                            this.$store.commit("user", null);
                            this.$store.commit("token", '');
                            console.log('user', this.$store.getters.user);
                        }
                    }
                })
            },

            thoroughDeleteArticle(id) {
                if (this.$store.getters.user == null) {
                    this.$store.commit("failedBlogAlter", '尚未登陆，请先登录')
                    return;
                }
                this.$http.get(
                    '/sysArticle/sysThoroughDeleteById', {
                        id: id
                    }, {
                        headers: {
                            'token': this.$store.getters.token
                        }
                    }
                ).then((response) => {
                    if (response.data.code == "SUCCESS") {
                        this.$store.commit("successBlogAlter", response.data.msg)
                        this.sysRecycle()
                    } else {
                        this.$store.commit("failedBlogAlter", response.data.msg)
                        if (response.data.code == "LOGIN_TIMEOUT") {
                            this.$store.commit("user", null);
                            this.$store.commit("token", '')
                            console.log('user', this.$store.getters.user);
                        }
                    }
                })
            },
        },
        mounted() {
            this.sysALL()
        }
    }
</script>
<style scoped>
</style>