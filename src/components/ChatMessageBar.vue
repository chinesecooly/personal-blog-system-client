<template>
    <v-list class="overflow-y-auto" :height="height*0.67" width="884" color="black">
        <v-list-item v-for="message,index in messages" :key="index">
            <v-list-item-avatar v-if="message.from!=from">
                <avataaars></avataaars>
            </v-list-item-avatar>
            <v-spacer v-if="message.from==from"></v-spacer>
            <v-list-item-content style=" max-width: 300px;" class="">
                <v-card max-width="300" min-width="150" color=" grey darken-2" min-height="50"
                    class="mt-5 pa-2 text-justify" rounded="4">
                    {{message.msg}}
                </v-card>
            </v-list-item-content>
            <v-list-item-avatar v-if="message.from==from">
                <avataaars></avataaars>
            </v-list-item-avatar>
        </v-list-item>
        <div id="adjustScrollBar"></div>
    </v-list>
</template>

<script>
    import Avataaars from 'vuejs-avataaars'
    export default {
        components: {
            Avataaars
        },
        props: {
            toUser: ''
        },
        data: () => ({
            menu: false,
            messages: [],
            height: 0,
            from: '',
            adjustScrollBar: null
        }),
        methods: {
            getMessages(key) {
                if (window.sessionStorage.getItem(key) != null) {
                    let newMsg = JSON.parse(window.sessionStorage.getItem(key)).slice(this.messages.length - 1);
                    this.messages.push(...newMsg);
                    setTimeout(() => {
                        this.adjustScrollBar.scrollIntoView(false);
                    }, 100);
                } else {
                    this.messages.splice(0, this.messages.length)
                }
            }
        },
        mounted() {
            this.height = window.innerHeight;
            this.from = this.$store.getters.user.name;
            this.adjustScrollBar = document.getElementById("adjustScrollBar");
        },
        watch: {
            toUser: function (newVal, oldVal) {
                this.getMessages(this.toUser)
            }
        }
    }
</script>
<style scoped>



</style>