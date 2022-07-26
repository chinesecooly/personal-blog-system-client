<template>
    <v-container>
        <v-row justify="center">
            <v-expansion-panels popout>
                <v-expansion-panel v-for="(article,index) in articles" :key="index" @click="getComment(article.id)">
                    <v-expansion-panel-header>{{article.title}}</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <comment-card v-for="comment,index in comments" :key="index" :comment="comment"
                            :articleId="article.id" :isManagement="true" @refreshComment="getComment(article.id)">
                        </comment-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-row>
    </v-container>
</template>
<script>
    import CommentCard from '@/components/CommentCard.vue'
    export default {
        data() {
            return {
                articles: [],
                comments: [],
            }
        },
        components: {
            CommentCard
        },
        methods: {
            getArticle() {
                this.$http.get('/article/sysArticle', null, null)
                    .then((response) => {
                        this.articles = response.data.data
                    }).catch((err) => {

                    });
            },
            getComment(id) {
                this.$http.get(
                    '/comment/getCommentByArticleId', {
                        articleId: id
                    }, null
                ).then((response) => {
                    this.comments = response.data.data
                })
            }
        },
        mounted() {
            this.getArticle();
        }

    }
</script>
<style scoped>

</style>