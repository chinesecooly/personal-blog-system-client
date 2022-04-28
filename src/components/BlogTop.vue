<template>
    <v-btn v-show="isShow" dark elevation="5" fab width="55" height="55" fixed right bottom class="mb-15" @click="top"
        id="top">
        <v-icon>mdi-arrow-up-bold</v-icon>
    </v-btn>
</template>
<script>
    export default {
        data() {
            return {
                isShow: false
            }
        },
        methods: {
            top() {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                })
            },
        },
        mounted() {
            let scroll = document.scrollingElement
            document.addEventListener('scroll', () => {
                if (scroll.scrollTop >= scroll.scrollHeight / 4) {
                    this.isShow = true;
                } else {
                    this.isShow = false;
                }
            })
        }
    }
</script>

<style scoped>
</style>