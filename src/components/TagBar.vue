<template>
    <tr>
        <td>{{ tag.body }}</td>
        <td>

            <v-dialog v-model="editord" persistent max-width="290">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" :depressed="true" text>
                        编辑
                    </v-btn>
                </template>
                <v-card>
                    <v-col cols="12">
                        <v-text-field label="分类专栏名称*" required></v-text-field>
                    </v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="editord = false">
                            取消
                        </v-btn>
                        <v-btn color="green darken-1" text @click="editor()">
                            确认
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="deld" persistent max-width="290">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="red" v-bind="attrs" v-on="on" :depressed="true" text>
                        删除
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="text-h5">
                        确定删除？
                    </v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="deld = false">
                            取消
                        </v-btn>
                        <v-btn color="green darken-1" text @click="del()">
                            删除
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </td>
    </tr>
</template>
<script>
    export default {
        props: {
            tag: null
        },
        data() {
            return {
                deld: false,
                editord: false
            }
        },
        methods: {
            editor() {
                this.editord = false
            },
            del() {
                deld = false;
                this.$http.get('/articleCategory/removeCategoryByArticleId', {
                    categoryId: this.category.id
                }, null).then((response) => {
                    this.$store.commit("successBlogAlter", response.data.msg)
                })
            },
        },
        mounted() {

        }
    }
</script>