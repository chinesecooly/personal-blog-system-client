<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="text-h5">发布文章</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="3">
                                文章摘要：
                            </v-col>
                            <v-col cols="12" md="9">
                                <v-textarea solo name="input-7-4" v-model="description"></v-textarea>
                            </v-col>
                        </v-row>
                        <article-tag ref="tag"></article-tag>
                        <v-row>
                            <v-col cols="12" md="3">
                                文章分类：
                            </v-col>

                            <v-col cols="12" md="9">
                                <v-checkbox v-for="category,index in categories" :key="index" v-model="categoryValue"
                                    :label="category.body" :value="category" hide-details style="display:inline-block"
                                    class="mr-3">
                                </v-checkbox>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="savePublishInfo()">
                        取消
                    </v-btn>
                    <v-btn color="red darken-1" text @click="saveMd()" :loading="loading">
                        发布文章
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>
<script>
    import ArticleTag from '../components/ArticleTag.vue'
    export default {
        data: () => ({
            categories: [],
            categoryValue: [],
            description: '',
            tags: [],
            loading: false
        }),

        components: {
            ArticleTag
        },
        props: {
            dialog: false
        },
        mounted() {
            this.$http.get(
                '/category/idAndBody',
                null,
                null
            ).then((response) => {
                this.categories = response.data.data
            })
        },
        methods: {
            saveMd() {
                this.loading = true;
                this.tags = this.$refs.tag.model
                this.$emit('saveMd');
            },
            savePublishInfo() {
                this.$emit('savePublishInfo');

            }
        }
    }
</script>