<template>

    <v-simple-table>
        <template v-slot:default>
            <thead>
                <tr>
                    <th class="text-left">
                        类别
                    </th>
                    <th class="text-left">
                        操作
                    </th>
                    <th class="text-left">
                        设为付费专栏
                    </th>
                    <th class="text-left">
                        是否显示
                    </th>
                    <th class="text-left">
                        文章数
                    </th>
                    <th class="text-left">
                        订阅数
                    </th>
                </tr>
            </thead>
            <tbody>
                <category-bar v-for="category,index in categories" :key="index" :category="category"></category-bar>
            </tbody>
        </template>
    </v-simple-table>
</template>
<script>
    import CategoryBar from '@/components/CategoryBar.vue'
    export default {
        data() {
            return {
                categories: []
            }
        },
        components: {
            CategoryBar
        },
        methods: {
            getArticleCategory() {
                this.$http.get(
                    '/category/idAndBody',
                    null, null
                ).then((response) => {
                    this.categories = response.data.data
                })
            }

        },
        mounted() {
            this.getArticleCategory();
        }
    }
</script>
<style scoped>

</style>