<template>
    <v-list class="overflow-y-auto" :height="height*0.8" width="301" dark>
        <v-list-item-group color="primary">
            <v-list-item v-for="user,index in users" :key="index"
                @click="$emit('toUser',user.name);clearUnRead(user.name);">
                <v-list-item-avatar>
                    <avataaars></avataaars>
                </v-list-item-avatar>
                <v-list-item-content style="max-width: 200px;">
                    <v-list-item-title>
                        {{user.name}}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{user.email}}
                    </v-list-item-subtitle>
                </v-list-item-content>
                <v-badge color="red" dot v-if="unread==user.name">
                </v-badge>
            </v-list-item>
        </v-list-item-group>
    </v-list>
</template>
<script>
    import Avataaars from 'vuejs-avataaars'
    export default {
        components: {
            Avataaars
        },
        props: {
            unread: ''
        },
        data: () => ({
            menu: false,
            users: [],
            height: 0
        }),
        methods: {
            getAllUser() {
                this.$http.get(
                    '/user/allUser',
                    null, {
                        headers: {
                            'token': this.$store.getters.token
                        }
                    }
                ).then((response) => {
                    let filterUsers = response.data.data.filter((user) => {
                        if (user.name == this.$store.getters.user.name) {
                            return false;
                        } else {
                            return true;
                        }
                    })
                    this.users = filterUsers
                })
            },
            clearUnRead(name) {
                if (name == this.unread) {
                    console.log('unread');
                    this.$emit('clearUnRead')
                }
            }
        },
        mounted() {
            this.height = window.innerHeight;
            this.getAllUser();
        }
    }
</script>

<style scoped>
    .a {
        border-style: dashed;
        border-color: red;

    }
</style>