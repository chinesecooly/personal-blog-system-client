<template>
    <div class="text-center">
        <v-chip v-for="category,index in categories" :key="index" class="ma-2"
            @click="getClassifiedArticles(category.id)" color="primary" text-color="white">
            <v-icon left>
                mdi-book
            </v-icon>
            {{category.body}}
        </v-chip>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                categories: [{
                    id: -1,
                    body: 'default'
                }],

            }
        },
        mounted() {
            this.$http.get(
                '/category/idAndBody',
                null,
                null
            ).then((response) => {
                this.categories.push(...response.data.data)
            })
        },
        methods: {
            getClassifiedArticles(id) {
                this.$emit('getClassifiedArticles', id)
            }
        }
    }
</script>