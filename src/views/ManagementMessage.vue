<template>
    <v-card class="mx-auto">
        <v-toolbar color="pink" dark>
            <v-btn icon>
                <v-icon>mdi-message</v-icon>
            </v-btn>
            <v-toolbar-title>留言管理</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-dialog v-model="deleted" persistent max-width="500">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" icon depressed>
                        <v-icon dense>mdi-delete</v-icon>
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title><span class="text-h5">确定删除所选留言吗？</span></v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="deleted = false">
                            取消
                        </v-btn>
                        <v-btn color="green darken-1" text @click="deleteMessage()" :disabled="selected.length==0">
                            确认
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-toolbar>

        <v-list two-line>
            <v-list-item-group v-model="selected" active-class="pink--text" multiple>
                <template v-for="(item, index) in items">
                    <v-list-item :key="item.id">
                        <template v-slot:default="{ active }">
                            <v-list-item-content>
                                <v-list-item-subtitle class="text--primary" v-text="item.username">
                                </v-list-item-subtitle>
                                <v-list-item-title v-text="item.body"></v-list-item-title>
                                <v-list-item-subtitle v-text="item.modifiedTime"></v-list-item-subtitle>
                            </v-list-item-content>

                            <v-list-item-action>
                                <v-icon v-if="!active" color="grey lighten-1">
                                    mdi-checkbox-marked-circle
                                </v-icon>
                                <v-icon v-else color="yellow darken-3">
                                    mdi-checkbox-marked-circle
                                </v-icon>
                            </v-list-item-action>
                        </template>
                    </v-list-item>

                    <v-divider v-if="index < items.length - 1" :key="index"></v-divider>
                </template>
            </v-list-item-group>
        </v-list>
    </v-card>
</template>
<script>
    import MessageCard from '@/components/MessageCard.vue'
    export default {
        components: {
            MessageCard
        },
        data() {
            return {
                selected: [],
                items: [],
                deleted: false
            }
        },
        methods: {
            getMessage() {
                this.$http.get('/message/getMessage',
                    null, null).then((response) => {
                    this.items = response.data.data
                })
            },
            getUserName(id) {
                this.$http.get('/user/getUserById', {
                        id: id,
                    },
                    null
                ).then((response) => {
                    this.user = response.data.data.name
                })
            },
            deleteMessage() {
                this.deleted = false;
                this.$http.post('/sysMessage/deleteMessage', this.getSelectedItem(), {
                    headers: {
                        'token': this.$store.getters.token
                    }
                }).then((result) => {
                    if (result.data.code == 'SUCCESS') {
                        this.$store.commit('successBlogAlter', result.data.msg)
                        this.getMessage()
                    } else {
                        this.$store.commit('failedBlogAlter', result.data.msg)
                        this.getMessage()
                    }
                }).catch((err) => {
                    this.$store.commit('warningBlogAlter', '网络异常，请稍后重试')
                });
            },
            getSelectedItem() {
                let selectedItem = new Array();
                for (; this.selected.length != 0;) {
                    selectedItem.push(this.items[this.selected.pop()])
                }
                return selectedItem;
            }
        },
        mounted() {
            this.getMessage()
        },

    }
</script>
<style scoped>

</style>