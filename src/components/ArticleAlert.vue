<template>
    <div class="text-center">
        <v-snackbar color="red" v-model="$store.getters.blogAlter.failed" :timeout="timeout" top>
            {{ $store.getters.blogAlter.text }}
            <template v-slot:action="{ attrs }">
                <v-btn text v-bind="attrs" @click="$store.commit('closeFailedBlogAlter')">
                    关闭
                </v-btn>
            </template>
        </v-snackbar>
        <v-snackbar color="green" v-model="$store.getters.blogAlter.success" :timeout="timeout" top>
            {{ $store.getters.blogAlter.text }}
            <template v-slot:action="{ attrs }">
                <v-btn text v-bind="attrs" @click="$store.commit('closeSuccessBlogAlter')">
                    关闭
                </v-btn>
            </template>
        </v-snackbar>
        <v-snackbar color="orange" v-model="$store.getters.blogAlter.warning" :timeout="timeout" top>
            {{ $store.getters.blogAlter.text }}
            <template v-slot:action="{ attrs }">
                <v-btn text v-bind="attrs" @click="$store.commit('closeWarningBlogAlter')">
                    关闭
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>
<script>
    export default {
        data: () => ({
            timeout: 1800,
        }),
    }
</script>