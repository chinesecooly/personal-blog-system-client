<template>
    <v-container>
        <v-app-bar fixed elevation="8" class=" mt-3" dark height="50">
            <v-btn height="50px" text color="yellow">肉人的博客</v-btn>
            <v-btn v-for="(link,index) in links" :key="index" :to="link[1]" height="50px" min-width="100px" text>
                {{link[0]}}
            </v-btn>
            <v-spacer></v-spacer>
            <blog-find></blog-find>
            <v-btn rounded class=" mt-0.5 ml-10" icon>
                <v-icon>mdi-bell</v-icon>
            </v-btn>
            <v-progress-linear :active="$store.getters.loading" :indeterminate="$store.getters.loading" absolute bottom
                color="deep-purple accent-4">
            </v-progress-linear>
        </v-app-bar>
        <v-col style="position:relative;" class="mb-n5 mt-15">
            <v-textarea filled auto-grow label="请发表有价值的留言，博客留言不欢迎灌水。" rows="1" row-height="30" color="grey" rounded
                class="mb-n7" @focus="focus()" v-model="message" @blur="blur()">
            </v-textarea>
            <v-btn :color="color" rounded bottom absolute right width="100" class="mr-2 mb-2" dark
                @click="submitMessage()">
                发表
            </v-btn>
        </v-col>
        <v-timeline class="mt-10">
            <v-timeline-item v-for="(message, i) in messages" :key="i" :color="colors[Math.floor(Math.random() * 4)]"
                small>
                <span slot="opposite">{{messages[i].modifiedTime}}</span>
                <message-card :message="message"></message-card>
            </v-timeline-item>
        </v-timeline>
        <blog-user></blog-user>
    </v-container>
</template>

<script>
    import BlogFind from "@/components/BlogFind.vue";
    import BlogUser from '@/components/BlogUser.vue';
    import Avataaars from 'vuejs-avataaars'
    import MessageCard from '@/components/MessageCard.vue';
    export default {
        components: {
            BlogUser,
            BlogFind,
            Avataaars,
            MessageCard
        },
        data: () => ({
            links: [
                ['首页', '/home'],
                ['聊天室', '/chatRoom'],
                ['留言板', '/messageBoard'],
                ['实验室', '/lab']
            ],
            messages: [],
            color: 'grey lighten-1',
            message: '',
            colors: ['cyan', 'green', 'pink', 'amber', 'orange']
        }),
        methods: {
            focus() {
                this.color = 'red';
            },
            blur() {
                this.color = 'grey lighten-1';
            },
            submitMessage() {
                this.$http.post('/message/saveMessage', {
                    userId: this.$store.getters.user.id,
                    username: this.$store.getters.user.name,
                    body: this.message
                }).then((response) => {
                    if (response.data.code = "SUCCESS") {
                        this.$store.commit("successBlogAlter", "发布成功")
                        this.message = ''
                        this.submitMessageStyle(response.data.data);
                        this.getMessage();
                    } else {
                        this.$store.commit("failedBlogAlter", "发布失败")
                    }
                })
            },
            submitMessageStyle(messageId) {
                this.$http.post('/messageStyle/saveMessageStyle', {
                    messageId: messageId,
                    color: this.randomColor()
                })
            },
            getMessage() {
                this.$http.get('/message/getMessage',
                    null, null).then((response) => {
                    this.messages = response.data.data
                })
            },
            randomColor() {
                let color = ['cyan', 'green', 'pink', 'amber', 'orange'];
                return color[Math.floor(Math.random() * 4)]
            }
        },
        mounted() {
            this.getMessage();
        }

    }
</script>