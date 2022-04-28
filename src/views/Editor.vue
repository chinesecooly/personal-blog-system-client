<template>
    <div>
        <v-toolbar dense light class="mt-1">
            <v-btn class="mr-3 ml-1" to="/home" text rounded outlined color="grep">
                <v-icon large>mdi-arrow-left-thin</v-icon>
                文章管理
            </v-btn>
            <v-text-field v-model="articleTitle" placeholder="请输入文章标题（5~50个字）" rounded filled dense class="mt-6"
                outlined :suffix="titleSuffix" color="grep" :error="titleError" autofocus @blur="blur()"
                @focus="focus()" @input="input">
            </v-text-field>
            <v-btn rounded class="ml-4" outlined color="red" @click="savedraft()">保存草稿</v-btn>
            <v-btn rounded class="ml-4" color="red" @click=" activeDialog()">发布文章</v-btn>
        </v-toolbar>
        <v-divider></v-divider>

        <mavon-editor id="editor" v-model="articleBody" @imgAdd="$imgAdd" @imgDel="$imgDel" ref="md"
            previewBackground="#F5F5F5"></mavon-editor>

        <v-toolbar height="20" dense absolute bottom width="100%">
            <v-btn text class="ml-n3" small>markdown</v-btn>
            <v-btn text small>
                {{
                    articleBody.length 
                }} 字数
            </v-btn>
        </v-toolbar>
        <publish-card :dialog="dialog" @saveMd=" saveMd()" ref="pc" @savePublishInfo="savePublishInfo()"></publish-card>

    </div>
</template>
<script>
    import PublishCard from '../components/PublishCard.vue';
    export default {
        data() {
            return {
                id: '',
                articleBody: '@[TOC](文章目录) \n',
                articleTitle: '',
                titleError: false,
                isSave: false,
                dialog: false,
                url: '',
                tags: [],
                categories: [],
                description: ''
            }
        },
        components: {
            PublishCard
        },
        computed: {
            titleSuffix() {
                if (this.articleTitle.length < 5) {
                    return '还需要输入' + (5 - this.articleTitle.length) + '个字';
                } else {
                    return this.articleTitle.length + '/50';
                }
            },
            input() {
                if (this.articleTitle.length > 50) {
                    this.titleError = true;
                } else {
                    this.titleError = false;
                }
            }

        },
        methods: {
            blur() {
                if (this.articleTitle.length < 5) {
                    this.titleError = true;
                }
            },
            focus() {
                this.titleError = false;
            },
            // 绑定@imgAdd event
            $imgAdd(pos, $file) {
                // 第一步.将图片上传到服务器.
                let formdata = new FormData();
                formdata.append('image', $file);
                this.$http.post(
                    '/image/saveImage',
                    formdata, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                    }
                ).then((url) => {
                    // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                    /**
                     * $vm 指为mavonEditor实例，可以通过如下两种方式获取
                     * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
                     * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
                     */

                    this.$refs.md.$img2Url(pos, this.$store.getters.baseURL + "/image/getImage/" + url.data
                        .data);
                })
            },
            $imgDel(pos) {

                this.$http.get(
                    '/image/removeImage' + '/' + pos[0].substr(pos[0].lastIndexOf('/') + 1)
                )
            },
            activeDialog() {
                this.dialog = !this.dialog;
            },
            savePublishInfo() {
                this.dialog = !this.dialog
            },
            savedraft() {

            },
            saveMd() {
                this.$axios({
                    method: 'post',
                    url: '/article/saveMd',
                    data: {
                        articleBody: this.articleBody
                    }
                }).then((response) => {
                    this.url = response.data.data;
                    if (response.data.code == "SUCCESS") {
                        this.saveArticle();
                    } else {
                        this.$store.commit('failedBlogAlter', response.data.msg);
                    }
                })
            },
            saveArticle() {
                this.description = this.$refs.pc.description;
                this.$http.get(
                    '/article/saveArticle', {
                        title: this.articleTitle,
                        url: this.url,
                        description: this.description
                    },
                    null
                ).then((response) => {
                    if (response.data.code == "SUCCESS") {
                        this.id = response.data.data;
                        console.log('id', this.id);
                        this.savetag();
                        this.saveCategory();
                        this.$refs.pc.loading = false;
                        this.$store.commit('successBlogAlter', response.data.msg)
                        this.dialog = !this.dialog;
                    } else {
                        this.$store.commit('failedBlogAlter', response.data.msg)
                    }
                })
            },
            savetag() {
                this.tags = this.$refs.pc.tags;
                this.$axios({
                    method: 'post',
                    url: '/articleTag/saveArticleTag',
                    params: {
                        articleId: this.id
                    },
                    data: this.tags
                })
            },
            saveCategory() {
                for (const category of this.$refs.pc.categoryValue) {
                    this.categories.push({
                        categoryId: category.id
                    })
                }
                this.$axios({
                    method: 'post',
                    url: '/articleCategory/saveArticleCategory',
                    params: {
                        articleId: this.id
                    },
                    data: this.categories
                })
            }
        }
    }
</script>
<style scoped>
    #editor {
        width: 100%;
        height: 88%;
        position: fixed;
        z-index: 0;
    }
</style>