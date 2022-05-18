<template>
    <v-container>
        <v-row justify="center" class="mt-n6 mb-2">
            <v-avatar size="120">
                <avataaars :clotheType="clotheType" :clotheColor="clotheColor"></avataaars>
            </v-avatar>
        </v-row>
        <v-row>
            <v-select :items="clotheTypes" label="Solo field" solo v-model="clotheType" item-text="name"
                item-value="value">
            </v-select>
        </v-row>
        <v-row>
            <v-select :items="clotheColors" label="Solo field" solo v-model="clotheColor" item-text="name"
                item-value="value">
            </v-select>
        </v-row>
    </v-container>
</template>

<script>
    import Avataaars from 'vuejs-avataaars'
    export default {
        components: {
            Avataaars
        },
        data() {
            return {
                clotheTypes: [{
                        name: 'BlazerShirt',
                        value: 'BlazerShirt'
                    },
                    {
                        name: 'BlazerSweater',
                        value: 'BlazerSweater'
                    },
                    {
                        name: 'CollarSweater',
                        value: 'CollarSweater'
                    },
                    {
                        name: 'GraphicShirt',
                        value: 'GraphicShirt'
                    },
                    {
                        name: 'Hoodie',
                        value: 'Hoodie'
                    },
                    {
                        name: 'Overall',
                        value: 'Overall'
                    },

                ],
                clotheType: '',
                clotheColors: [{
                        name: 'Black',
                        value: 'Black'
                    },
                    {
                        name: 'Heather',
                        value: 'Heather'
                    },
                    {
                        name: 'PastelBlue',
                        value: 'PastelBlue'
                    },
                    {
                        name: 'PastelGreen',
                        value: 'PastelGreen'
                    },
                    {
                        name: 'Pink',
                        value: 'Pink'
                    },
                ],
                clotheColor: ''
            }
        }
    }
</script>