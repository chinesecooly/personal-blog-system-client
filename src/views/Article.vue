<template>
    <v-container fluid>
        <v-app-bar fixed elevation="8" class=" mt-3" dark height="50">
            <v-btn height="50px" text color="yellow">肉人的博客</v-btn>
            <v-btn v-for="(link,index) in links" :key="index" :to="link[1]" height="50px" min-width="100px" text>
                {{link[0]}}
            </v-btn>
            <v-spacer></v-spacer>
            <blog-find></blog-find>
            <v-btn rounded class=" mt-0.5 ml-10" icon>
                <v-icon>mdi-bell</v-icon>
            </v-btn>
            <v-btn rounded color="red" class=" mt-0.5 ml-10" to="/editor">
                <v-icon small>mdi-cog</v-icon>
                文章管理
            </v-btn>
            <v-progress-linear :active="$store.getters.loading" :indeterminate="$store.getters.loading" absolute bottom
                color="deep-purple accent-4">
            </v-progress-linear>
        </v-app-bar>
        <v-row no-gutters>
            <v-col cols="12" md="2" lg="2" id="resizeCtl">
            </v-col>
            <v-col cols="12" md="8" lg="8">
                <v-toolbar class="mt-16">
                    <v-toolbar-title>
                        {{articletitle}}
                    </v-toolbar-title>
                </v-toolbar>
            </v-col>
            <v-col cols="12" md="2" lg="2" id="resizeCtl">
            </v-col>


        </v-row>
        <v-row no-gutters>
            <v-col cols="12" md="2" lg="2" id="resizeCtl">
            </v-col>
            <v-col cols="12" md="8" lg="8">
                <v-toolbar color="#F5F5F5" dense height="25">
                    <v-btn text color="grey lighten-1" height="25" disabled small>
                        <v-icon small>mdi-clock</v-icon>
                        于 {{ modifiedTime}} 发布
                    </v-btn>
                    <v-btn text color="grey lighten-1" height="25" disabled small>
                        <v-icon small>mdi-eye</v-icon>
                        观看人数：{{ readCount}}
                    </v-btn>
                    <v-btn text color="grey lighten-1" height="25" disabled small>
                        <v-icon small>mdi-tag</v-icon>
                        文章标签：
                        <v-chip v-for="tag,index in tags" :key="index" class="mr-1" x-small color="grey lighten-2 ">
                            {{tag.body}}
                        </v-chip>
                    </v-btn>
                </v-toolbar>
            </v-col>
            <v-col cols="12" md="2" lg="2" id="resizeCtl">
            </v-col>

        </v-row>

        <v-row no-gutters>
            <v-col cols="12" md="2" lg="2" id="resizeCtl">
            </v-col>
            <v-col cols="12" md="8" lg="8" id="resizeCtl">
                <mavon-editor id="editor" v-model="articleBody" :subfield="false" defaultOpen="preview"
                    :editable="false" :toolbarsFlag="false" :shortCut="false" elevation="8">
                </mavon-editor>
            </v-col>
            <v-col cols="12" md="2" lg="2" id="resizeCtl">
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col cols="12" md="2" lg="2" id="resizeCtl">
            </v-col>
            <v-col cols="12" md="8" lg="8">
                <v-toolbar color="#F5F5F5" dense>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon :color="thumbColor" class="ml-1" v-bind="attrs" v-on="on" @click="thumb()">
                                <v-icon>mdi-thumb-up</v-icon>
                            </v-btn>
                        </template>
                        <span>点赞</span>
                    </v-tooltip>

                    {{likeCount}}
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon :color="starColor" class="ml-1" v-bind="attrs" v-on="on" @click="star()">
                                <v-icon>mdi-star-box</v-icon>
                            </v-btn>
                        </template>
                        <span>收藏</span>
                    </v-tooltip>
                    {{favoriteCount}}
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon class="ml-1" v-bind="attrs" v-on="on">
                                <v-icon>mdi-comment-processing</v-icon>
                            </v-btn>
                        </template>
                        <span>评论</span>
                    </v-tooltip>
                    {{commentCount}}
                    <v-spacer></v-spacer>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon class="ml-1" v-bind="attrs" v-on="on">
                                <v-icon>mdi-share-all</v-icon>
                            </v-btn>
                        </template>
                        <span>分享</span>
                    </v-tooltip>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon class="ml-1" v-bind="attrs" v-on="on">
                                <v-icon>mdi-cup</v-icon>
                            </v-btn>
                        </template>
                        <span>请我喝茶</span>
                    </v-tooltip>

                </v-toolbar>
            </v-col>
            <v-col cols="12" md="2" lg="2">

            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="2" lg="2">
            </v-col>
            <v-col md="8" lg="8" style="position:relative;">
                <v-textarea filled auto-grow label="请发表有价值的评论，博客评论不欢迎灌水。" rows="1" row-height="30" color="grey" rounded
                    class="mb-n7" @focus="focus()" v-model="comment" @blur="blur()">
                </v-textarea>
                <v-btn :color="color" rounded bottom absolute right width="100" class="mr-2 mb-2" dark>
                    评论
                </v-btn>
            </v-col>
            <v-col cols="12" md="2" lg="2">

            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="2" lg="2">
            </v-col>
            <v-col md="8" lg="8">
                <comment-card></comment-card>
            </v-col>
            <v-col cols="12" md="2" lg="2">

            </v-col>
        </v-row>
        <blog-top></blog-top>
    </v-container>
</template>
<script>
    import BlogFind from "@/components/BlogFind.vue";
    import CommentCard from '@/components/CommentCard.vue';
    import BlogTop from '@/components/BlogTop.vue';
    export default {
        components: {
            BlogFind,
            CommentCard,
            BlogTop,
        },
        data() {
            return {
                articletitle: '',
                articleBody: '@[TOC](文章目录) \n # hello \n 1 \n 1 \n 1 \n 1 \n 1\n 1\n 1\n 1\n 1\n 1\n 1\n 1\n 1\n 1\n 1\n 1 \n # second \n 1 \n 1\n 1\n 1\n 1\n 1\n 1\n 1\n 1\n 1\n 1\n 1\n 1 \n',
                modifiedTime: null,
                links: [
                    ['首页', '/home'],
                    ['聊天室', '/chatRoom'],
                    ['留言板', '/messageBoard'],
                    ['实验室', '/lab']
                ],
                comment: '',
                color: 'grey lighten-1',
                readCount: 0,
                likeCount: 0,
                favoriteCount: 0,
                commentCount: 0,
                tags: [],
                thumbColor: '#707070',
                starColor: '#707070'

            }
        },
        methods: {
            focus() {
                this.color = 'red';
            },
            blur() {
                this.color = 'grey lighten-1';
            },
            thumb() {
                if (this.thumbColor == '#707070') {
                    this.thumbColor = 'red';
                    this.likeCount++;
                    this.$http.get(
                        '/article/addLikeCount', {
                            articleId: this.$route.params.id
                        },
                        null
                    )
                } else {
                    this.thumbColor = '#707070'
                    this.likeCount--;
                    this.$http.get(
                        '/article/subLikeCount', {
                            articleId: this.$route.params.id
                        },
                        null
                    )
                }
            },
            star() {
                if (this.starColor == '#707070') {
                    this.starColor = 'orange darken-2';
                    this.favoriteCount++;
                    this.$http.get(
                        '/article/addFavoriteCount', {
                            articleId: this.$route.params.id
                        },
                        null
                    )
                } else {
                    this.starColor = '#707070'
                    this.favoriteCount--;
                    this.$http.get(
                        '/article/subFavoriteCount', {
                            articleId: this.$route.params.id
                        },
                        null
                    )
                }
            }
        },
        mounted() {
            this.$store.commit('loading');
            this.$http.get(
                '/article/articleInfo', {
                    articleId: this.$route.params.id
                },
                null
            ).then((response) => {
                this.articletitle = response.data.data.title;
                this.modifiedTime = response.data.data.modifiedTime;
                this.readCount = response.data.data.readCount;
                this.likeCount = response.data.data.likeCount;
                this.favoriteCount = response.data.data.favoriteCount;
                this.commentCount = response.data.data.commentCount;
            });
            this.$http.get(
                '/articleTag/getArticleTag', {
                    articleId: this.$route.params.id
                },
                null
            ).then((response) => {
                this.tags = response.data.data;
            });
            this.$http.get(
                '/article/articleBody', {
                    articleId: this.$route.params.id
                },
                null
            ).then((response) => {
                this.articleBody = response.data;
                this.$store.commit('loading');
            })
        }
    }
</script>

<style scoped>
    #editor {
        z-index: 0;

    }
</style>