<template>
    <v-container>
        <v-btn elevation="5" fab dark width="55" height="55" fixed bottom right @click="overlay = !overlay">
            <v-icon>mdi-account</v-icon>
        </v-btn>
        <v-overlay :value="overlay" opacity=".8">
            <validation-observer ref="observer" v-slot="{ invalid }">
                <form @submit.prevent="submit">
                    <validation-provider v-slot="{ errors }" name="Name" rules="required|max:10">
                        <v-text-field v-model="name" :counter="10" :error-messages="errors" label="昵称" required>
                        </v-text-field>
                    </validation-provider>
                    <validation-provider v-slot="{ errors }" name="email" rules="required|email">
                        <v-text-field v-model="email" :error-messages="errors" label="邮箱" required>
                        </v-text-field>
                    </validation-provider>
                    <validation-provider v-slot="{ errors }" rules="required" name="checkbox">
                        <v-checkbox v-model="checkbox" :error-messages="errors" value="1" label="记住昵称和邮箱"
                            type="checkbox" required></v-checkbox>
                    </validation-provider>

                    <v-btn class="mr-4" type="submit" :disabled="invalid">
                        登录
                    </v-btn>
                    <v-btn @click="clear">
                        关闭
                    </v-btn>
                </form>
            </validation-observer>
        </v-overlay>
    </v-container>
</template>
<script>
    import {
        required,
        digits,
        email,
        max,
        regex
    } from 'vee-validate/dist/rules'
    import {
        extend,
        ValidationObserver,
        ValidationProvider,
        setInteractionMode
    } from 'vee-validate'

    setInteractionMode('eager')

    extend('digits', {
        ...digits,
        message: '{_field_} needs to be {length} digits. ({_value_})',
    })

    extend('required', {
        ...required,
        message: '{_field_} can not be empty',
    })

    extend('max', {
        ...max,
        message: '{_field_} may not be greater than {length} characters',
    })

    extend('regex', {
        ...regex,
        message: '{_field_} {_value_} does not match {regex}',
    })

    extend('email', {
        ...email,
        message: 'Email must be valid',
    })
    export default {
        data: () => ({
            overlay: false,
            name: '',
            email: '',
            items: [
                '名称',
                'Item 2',
                'Item 3',
                'Item 4',
            ],
            checkbox: null,
        }),
        methods: {
            submit() {
                this.$refs.observer.validate()
            },
            clear() {
                this.name = ''
                this.phoneNumber = ''
                this.email = ''
                this.select = null
                this.checkbox = null
                this.overlay = false;
                this.$refs.observer.reset()
            },
        },
        components: {
            ValidationObserver,
            ValidationProvider
        }
    }
</script>