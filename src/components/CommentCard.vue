<template>
    <v-container fluid>
        <v-row no-gutters>
            <v-col cols="12" md="1" lg="1">
                <v-avatar size="50">
                    <avataaars></avataaars>
                </v-avatar>
            </v-col>
            <v-col cols="12" md="11" lg="11">
                <v-row no-gutters>
                    <v-card width="100%" flat>
                        <v-card-text>
                            {{user.name}}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {{comment.modifiedTime}}
                        </v-card-text>
                        <v-card-title>
                            {{comment.body}}

                            <v-spacer></v-spacer>
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn text :color="thumbColor" v-bind="attrs" v-on="on" @click="thumb()">
                                        <v-icon>mdi-thumb-up</v-icon>{{commt==null?comment.likeCount:commt.likeCount}}
                                    </v-btn>
                                </template>
                                <span>点赞</span>
                            </v-tooltip>

                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn text v-bind="attrs" v-on="on" class="ml-4" @click="showReply()">
                                        <v-icon>mdi-comment-processing</v-icon>{{comment.replyCount}}
                                    </v-btn>
                                </template>
                                <span>回复</span>
                            </v-tooltip>


                            <v-dialog v-model="deleted" persistent max-width="290">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn text v-bind="attrs" v-on="on" class="ml-4" color="red" v-show="isManagement">
                                        <v-icon>mdi-delete</v-icon>删除
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-col cols="12">
                                        此操作将删除该评论的所有回复，确认继续吗？
                                    </v-col>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="green darken-1" text @click="deleted = false">
                                            取消
                                        </v-btn>
                                        <v-btn color="green darken-1" text @click="deleteComment()">
                                            确认
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-card-title>
                    </v-card>
                    <v-expand-transition>
                        <v-card v-show="flag" width="100%" flat>
                            <v-col style="position:relative;" class="mb-n2">
                                <v-textarea filled auto-grow label="请发表有价值的评论，博客评论不欢迎灌水。" rows="1" row-height="30"
                                    color="grey" rounded class="mb-n7" @focus="focus()" v-model="reply" @blur="blur()">
                                </v-textarea>
                                <v-btn :color="color" rounded bottom absolute right width="100" class="mr-2 mb-2" dark
                                    @click="submitReply()">
                                    回复
                                </v-btn>
                            </v-col>
                        </v-card>
                    </v-expand-transition>
                    <comment-card v-for="reply,index in replies" :key="index" :comment="reply" :articleId="articleId"
                        :isManagement="isManagement" @refreshComment="getReplies()"></comment-card>
                </v-row>
                <v-divider></v-divider>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
    import Avataaars from 'vuejs-avataaars'
    export default {
        name: 'commentCard',
        props: {
            comment: null,
            articleId: null,
            isManagement: false
        },
        data() {
            return {
                thumbColor: null,
                user: '',
                commt: null,
                reply: '',
                flag: false,
                color: 'grey lighten-1',
                replies: [],
                deleted: false
            }
        },
        methods: {
            thumb() {
                if (this.thumbColor == null) {
                    this.thumbColor = 'red';
                    this.commt.likeCount++;
                    this.$http.get(
                        '/comment/addLikeCount', {
                            commentId: this.comment.id
                        },
                        null
                    )
                } else {
                    this.thumbColor = null;
                    this.commt.likeCount--;
                    this.$http.get(
                        '/comment/subLikeCount', {
                            commentId: this.comment.id
                        },
                        null
                    )
                }
            },
            getUsername() {
                this.$http.get('/user/getUserById', {
                        id: this.comment.userId,
                    },
                    null
                ).then((response) => {
                    this.user = response.data.data
                })
            },
            showReply() {
                this.flag = !this.flag
            },
            focus() {
                this.color = 'red';
            },
            blur() {
                this.color = 'grey lighten-1';
            },
            submitReply() {
                this.$http.post(
                    '/comment/publishComment', {
                        articleId: this.articleId == null ? this.$route.params.id : this.articleId,
                        userId: this.$store.getters.user.id,
                        fatherId: this.comment.id,
                        body: this.reply,
                    }, null
                ).then((response) => {
                    if (response.data.code = "SUCCESS") {
                        this.getReplies()
                        this.reply = ''
                        this.commt.replyCount++;
                        this.flag = false
                        this.$http.get(
                            '/comment/addReplyCount', {
                                commentId: this.commt.id
                            },
                            null
                        )
                    }
                })
            },
            getReplies() {
                this.$http.get('/comment/getReply', {
                    fatherId: this.commt.id,
                    articleId: this.commt.articleId
                }, null).then((response) => {
                    this.replies = response.data.data
                })
            },
            deleteComment() {
                this.deleted = false
                this.$http.get('/comment/removeCommentByCommentId', {
                    commentId: this.comment.id
                }, null).then((response) => {
                    this.$emit("refreshComment");
                    this.getReplies()
                    this.$store.commit("successBlogAlter", response.data.msg)
                })
            }
        },
        mounted() {
            this.commt = this.comment
            this.getUsername()
            this.getReplies()
        },
        watch: {
            comment() {
                this.commt = this.comment
                this.thumbColor = null
                this.getUsername()
            }
        },
        components: {
            Avataaars
        },

    }
</script>
<style scoped>
    .a {
        border-style: dashed;
        border-color: red;
    }
</style>