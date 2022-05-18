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
                <tr v-for="user in users" :key="user.name">
                    <td>{{ user.body }}</td>
                    <td>
                        <v-btn text @click="editor(user.id)">
                            编辑
                        </v-btn>
                        <v-btn text color="red" @click="del(user.id)">
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
                users: []
            }
        },
        methods: {
            getArticleCategory() {
                this.$http.get(
                    '/category/idAndBody',
                    null, null
                ).then((response) => {
                    this.users = response.data.data
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