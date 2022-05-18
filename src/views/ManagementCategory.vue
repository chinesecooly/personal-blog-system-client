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
                <tr v-for="category in categories" :key="category.name">
                    <td>{{ category.body }}</td>
                    <td>
                        <v-btn text @click="editor(category.id)">
                            编辑
                        </v-btn>
                        <v-btn text color="red" @click="del(category.id)">
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
                categories: []
            }
        },
        methods: {
            getArticleCategory() {
                this.$http.get(
                    '/category/idAndBody',
                    null, null
                ).then((response) => {
                    this.categories = response.data.data
                })
            },
            editor(id) {

            },
            del(id) {

            },
        },
        mounted() {
            this.getArticleCategory();
        }
    }
</script>
<style scoped>

</style>