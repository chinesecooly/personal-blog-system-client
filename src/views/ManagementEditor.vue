<template>
    <div>
        <v-toolbar dense light class="mt-1">
            <v-btn class="mr-3 ml-1" to="/management" text rounded outlined color="grep">
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
            previewBackground="#F5F5F5" fontSize="17px" codeStyle="atom-one-dark" :toolbars="toolbars">
        </mavon-editor>

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
                articleBody: '',
                articleTitle: '',
                titleError: false,
                isSave: false,
                dialog: false,
                url: '',
                isDraft: 0,
                tags: [],
                categories: [],
                description: '',
                toolbars: {
                    bold: true, // 粗体
                    italic: true, // 斜体
                    header: true, // 标题
                    underline: true, // 下划线
                    strikethrough: true, // 中划线
                    mark: true, // 标记
                    superscript: true, // 上角标
                    subscript: true, // 下角标
                    quote: true, // 引用
                    ol: true, // 有序列表
                    ul: true, // 无序列表
                    link: true, // 链接
                    imagelink: true, // 图片链接
                    code: true, // code
                    table: true, // 表格
                    fullscreen: true, // 全屏编辑
                    readmodel: true, // 沉浸式阅读
                    htmlcode: false, // 展示html源码
                    help: true, // 帮助
                    /* 1.3.5 */
                    undo: true, // 上一步
                    redo: true, // 下一步
                    trash: false, // 清空
                    save: false, // 保存（触发events中的save事件）
                    /* 1.4.2 */
                    navigation: true, // 导航目录
                    /* 2.1.8 */
                    alignleft: true, // 左对齐
                    aligncenter: true, // 居中
                    alignright: true, // 右对齐
                    /* 2.2.1 */
                    subfield: true, // 单双栏模式
                    preview: true, // 预览
                }
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
                this.$axios({
                    method: 'post',
                    url: '/article/saveMdByURL',
                    params: {
                        url: this.url
                    },
                    data: {
                        articleBody: this.articleBody
                    }
                }).then((response) => {
                    if (response.data.code == "SUCCESS") {
                        this.$store.commit('successBlogAlter', response.data.msg);
                    } else {
                        this.$store.commit('failedBlogAlter', response.data.msg);
                    }
                })

            },
            saveMd() {
                this.$axios({
                    method: 'post',
                    url: '/article/saveMdByURL',
                    params: {
                        url: this.url
                    },
                    data: {
                        articleBody: this.articleBody
                    }
                }).then((response) => {
                    if (response.data.code == "SUCCESS") {
                        this.publishDraft()
                    } else {
                        this.$store.commit('failedBlogAlter', response.data.msg);
                    }
                })

            },
            publishDraft() {
                this.$http.get(
                    '/article/publishDraft', {
                        id: this.id
                    },
                    null
                ).then((response) => {
                    if (response.data.code == "SUCCESS") {
                        this.saveDescription()
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
            },
            saveDescription() {
                this.description = this.$refs.pc.description;
                this.$http.get(
                    '/article/saveDescription', {
                        id: this.id,
                        description: this.description
                    },
                    null
                )
            },
            $click() {

            }
        },
        mounted() {
            this.id = this.$route.params.id;
            this.$http.get(
                '/article/articleInfo', {
                    articleId: this.id
                },
                null
            ).then((response) => {
                this.articleTitle = response.data.data.title;
                this.url = response.data.data.url;
                this.isDraft = response.data.data.isDraft;
            });
            this.$store.commit('loading');
            this.$http.get(
                '/article/articleBody', {
                    articleId: this.id
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
        width: 100%;
        height: 88%;
        position: fixed;
        z-index: 0;
    }
</style>