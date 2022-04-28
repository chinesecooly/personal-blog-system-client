<template>
    <v-container>
        <v-hover v-slot="{ hover }" close-delay="200">
            <v-card class="mx-auto" max-width="600" min-height="150" :elevation="hover ? 14 : 5"
                :class="{ 'on-hover': hover }" color="purple lighten-4" :to="'/article/'+id" @click="readCountAdd()">
                <v-card-title>
                    {{title}}
                </v-card-title>

                <v-card-text>
                    {{description}}
                </v-card-text>
                <v-card-actions>
                    <v-chip v-for="tag,index in tag" :key="index" class="mr-1">
                        {{tag.body}}
                    </v-chip>
                    <v-spacer></v-spacer>
                    <v-btn text>
                        <v-icon>mdi-eye</v-icon>
                        {{readCount}}
                    </v-btn>
                    <v-btn text>
                        <v-icon>mdi-thumb-up</v-icon>
                        {{likeCount}}
                    </v-btn>

                    <v-btn text>
                        <v-icon>mdi-star-box</v-icon>
                        {{favoriteCount}}
                    </v-btn>
                    <v-btn text>
                        <v-icon>mdi-comment</v-icon>
                        {{commentCount}}
                    </v-btn>

                </v-card-actions>
            </v-card>
        </v-hover>
    </v-container>

</template>
<script>
    export default {
        props: {
            articleInfo: null
        },
        data() {
            return {
                id: '',
                title: '',
                url: '',
                description: '',
                likeCount: 0,
                favoriteCount: 0,
                commentCount: 0,
                readCount: 0,
                tag: []

            }
        },
        mounted() {
            this.id = this.articleInfo.id;
            this.title = this.articleInfo.title;
            this.url = this.articleInfo.url;
            this.description = this.articleInfo.description;
            this.likeCount = this.articleInfo.likeCount;
            this.favoriteCount = this.articleInfo.favoriteCount;
            this.commentCount = this.articleInfo.commentCount;
            this.readCount = this.articleInfo.readCount;
            this.$http.get(
                '/articleTag/getArticleTag', {
                    articleId: this.id
                },
                null
            ).then((response) => {
                this.tag = response.data.data;
            })
        },
        methods: {
            readCountAdd() {
                this.$http.get(
                    '/article/addReadCount', {
                        articleId: this.id
                    },
                    null
                )
            }
        }
    }
</script>
<style scoped>
</style>