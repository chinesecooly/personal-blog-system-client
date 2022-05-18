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
        <v-row class="mt-16 grey darken-3">
            <v-col cols="3" class=" overflow-x-hidden">
                <chat-user-bar @toUser="toUser($event)" :unread="unread" @clearUnRead="unread=''"></chat-user-bar>
            </v-col>
            <v-col cols="9" class=" overflow-x-hidden">
                <v-card height="30" dark class="text-center" flat>
                    {{to}}
                </v-card>
                <v-card width="884" :height="height*0.67" rounded="0" class="overflow-x-hidden">
                    <chat-message-bar :toUser="to" ref="messageBar"></chat-message-bar>
                </v-card>
                <v-toolbar dark height="50">
                    <v-btn icon>
                        <v-icon>
                            mdi-microphone
                        </v-icon>
                    </v-btn>
                    <v-text-field label="Enter发送消息" flat hide-details solo-inverted dark dense @keydown.enter="send()"
                        v-model="chatRequestMsg.content">
                    </v-text-field>
                    <v-btn icon>
                        <v-icon>
                            mdi-emoticon-happy-outline
                        </v-icon>
                    </v-btn>
                    <v-btn icon>
                        <v-icon>
                            mdi-plus-circle-outline
                        </v-icon>
                    </v-btn>
                </v-toolbar>
            </v-col>
        </v-row>
        <blog-user></blog-user>

    </v-container>
</template>

<script>
    import BlogFind from "@/components/BlogFind.vue";
    import BlogUser from '@/components/BlogUser.vue';
    import ChatUserBar from '@/components/ChatUserBar.vue';
    import ChatMessageBar from '@/components/ChatMessageBar';
    export default {
        components: {
            BlogFind,
            BlogUser,
            ChatUserBar,
            ChatMessageBar,
            ChatMessageBar
        },
        data: () => ({
            links: [
                ['首页', '/home'],
                ['聊天室', '/chatRoom'],
                ['留言板', '/messageBoard'],
                ['实验室', '/lab']
            ],
            height: 0,
            wsc: null,
            loginRequestMsg: {
                sequenceId: 0,
                messageType: 0,
                username: ''
            },
            chatRequestMsg: {
                sequenceId: 0,
                messageType: 2,
                from: '',
                to: '',
                content: ''
            },
            from: '',
            to: '',
            unread: '',
            messageRecord: []
        }),
        methods: {
            toUser(user) {
                this.to = user;
                console.log(user);
                this.$refs.messageBar.getMessages(user);
            },
            send() {
                this.chatRequestMsg.from = this.from;
                this.chatRequestMsg.to = this.to;
                this.saveSessionMessageRecord(this.to, this.from, this.chatRequestMsg.content);
                this.wsc.send(JSON.stringify(this.chatRequestMsg));
                this.$refs.messageBar.getMessages(this.to);
                this.chatRequestMsg.content = ''
            },
            saveSessionMessageRecord(key, from, msg) {
                let sessionMessageRecord = null;
                if (window.sessionStorage.getItem(key) == null) {
                    sessionMessageRecord = [];
                } else {
                    sessionMessageRecord = JSON.parse(window.sessionStorage.getItem(key));
                }
                sessionMessageRecord.push({
                    from: from,
                    msg: msg
                })
                window.sessionStorage.setItem(key, JSON.stringify(sessionMessageRecord))
                if (from == this.to) {
                    this.$refs.messageBar.getMessages(this.to);
                }
            },
            unreadPot(from) {
                if (from != this.to) {
                    this.unread = from;
                }
            }
        },
        mounted() {
            this.height = window.innerHeight;
            this.from = this.$store.getters.user.name;
            this.wsc = new WebSocket('ws://localhost:8000/ws');
            this.wsc.onopen = (event) => {
                this.loginRequestMsg.username = this.from;
                this.wsc.send(JSON.stringify(this.loginRequestMsg));
            }
            this.wsc.onmessage = (event) => {
                let responseMessage = JSON.parse(event.data);
                switch (responseMessage.messageType) {
                    case 1:
                        this.$store.commit('successBlogAlter', responseMessage.reason)
                        break;
                    case 3:
                        this.saveSessionMessageRecord(responseMessage.from, responseMessage.from, responseMessage
                            .content);
                        this.unreadPot(responseMessage.from)
                        break;
                    default:
                        break;
                }
            }
            this.wsc.onclose = (event) => {

            };

        }
    }
</script>