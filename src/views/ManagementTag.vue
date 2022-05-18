<template>
    <v-simple-table>
        <template v-slot:default>
            <thead>
                <tr>
                    <th class="text-left">
                        名称
                    </th>
                    <th class="text-left">
                        操作
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="tag in tags" :key="tag.name">
                    <td>{{ tag.body }}</td>
                    <td>
                        <v-btn text @click="editor(tag.id)">
                            编辑
                        </v-btn>
                        <v-btn text color="red" @click="del(tag.id)">
                            删除
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </template>
    </v-simple-table>
</template>
<script>
    export default {
        data() {
            return {
                tags: []
            }
        },
        methods: {
            getArticleTag() {
                this.$http.get(
                    '/tag/all',
                    null, null
                ).then((response) => {
                    this.tags = response.data.data
                })
            },
            editor(id) {

            },
            del(id) {

            },
        },
        mounted() {
            this.getArticleTag();
        }
    }
</script>
<style scoped>

</style>