<template>
    <v-container fluid>
        <v-row justify="center">
            <v-avatar size="100">
                <avataaars :clotheType="clotheType" :eyebrowType="eyebrowType" :eyeType="eyeType" :mouthType="mouthType"
                    :topType="hairType" :clotheColor="'black'" :hairColor="'black'" :skinColor="'Yellow'"
                    :accessoriesType="'Blank'" :facialHairType="facialHairType" :isCircle="false"
                    :facialHairColor="'black'">
                </avataaars>
            </v-avatar>
        </v-row>
        <v-row v-show="selected" no-gutters class="mt-5">
            <v-select :items="hairTypes" label="头发" solo v-model="hairType" item-text="name" item-value="value">
            </v-select>
        </v-row>
        <v-row v-show="selected" no-gutters dense>
            <v-select :items="eyebrowTypes" label="眉毛" solo v-model="eyebrowType" item-text="name" item-value="value">
            </v-select>
        </v-row>
        <v-row v-show="selected" no-gutters dense>
            <v-select :items="eyeTypes" label="眼睛" solo v-model="eyeType" item-text="name" item-value="value">
            </v-select>
        </v-row>
        <v-row v-show="selected" no-gutters>
            <v-select :items="mouthTypes" label="嘴巴" solo v-model="mouthType" item-text="name" item-value="value">
            </v-select>
        </v-row>
        <v-row v-show="selected" no-gutters>
            <v-select :items="facialHairTypes" label="胡子" solo v-model="facialHairType" item-text="name"
                item-value="value">
            </v-select>
        </v-row>
        <v-row v-show="selected" no-gutters>
            <v-select :items="clotheTypes" label="上衣" solo v-model="clotheType" item-text="name" item-value="value">
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
        props: {
            selected: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                clotheTypes: [{
                        name: '西装',
                        value: 'BlazerSweater'
                    },
                    {
                        name: '毛衣',
                        value: 'CollarSweater'
                    },
                    {
                        name: 'T恤',
                        value: 'GraphicShirt'
                    },
                    {
                        name: '卫衣',
                        value: 'Hoodie'
                    },
                    {
                        name: '背心',
                        value: 'Overall'
                    },
                ],
                clotheType: 'Overall',
                eyebrowTypes: [{
                        name: '生气',
                        value: 'Angry'
                    }, {
                        name: '上下',
                        value: 'UpDown'
                    },
                    {
                        name: '自然',
                        value: 'DefaultNatural'
                    },
                    {
                        name: '一字眉',
                        value: 'FlatNatural'
                    },
                ],
                eyebrowType: 'UpDown',
                eyeTypes: [{
                        name: '关闭',
                        value: 'Close'
                    },
                    {
                        name: '流泪',
                        value: 'Cry'
                    },
                    {
                        name: '高兴',
                        value: 'Happy'
                    },
                    {
                        name: '自然',
                        value: 'Default'
                    },
                    {
                        name: '惊讶',
                        value: 'Surprised'
                    },
                ],
                eyeType: 'Surprised',
                mouthTypes: [{
                        name: '关心',
                        value: 'Concerned'
                    },
                    {
                        name: '默认',
                        value: 'Default'
                    },
                    {
                        name: '不相信',
                        value: 'Disbelief'
                    },
                    {
                        name: '高兴',
                        value: 'Grimace'
                    },
                ],
                mouthType: 'Grimace',
                facialHairTypes: [{
                        name: '没胡子',
                        value: 'Blank'
                    },
                    {
                        name: '大胡子',
                        value: 'BeardMedium'
                    },
                    {
                        name: '小胡子',
                        value: 'BeardLight'
                    },

                    {
                        name: '八字胡',
                        value: 'MoustacheMagnum'
                    },
                ],
                facialHairType: 'Blank',
                hairTypes: [{
                        name: '没头发',
                        value: 'NoHair'
                    },
                    {
                        name: '短发',
                        value: 'ShortHairShortFlat'
                    },
                    {
                        name: '寸头',
                        value: 'ShortHairTheCaesarSidePart'
                    },
                    {
                        name: '长发',
                        value: 'LongHairBob'
                    },
                ],
                hairType: 'ShortHairTheCaesarSidePart'
            }
        },
        methods: {
            saveAvatar(userId) {
                this.$http.post('/userAvatar/saveAvatar', {
                    userId: userId,
                    hairType: this.hairType,
                    eyebrowType: this.eyebrowType,
                    eyeType: this.eyeType,
                    mouthType: this.mouthType,
                    facialHairType: this.facialHairType,
                    clotheType: this.clotheType
                }, null)
            },
            getAvatarByUserId(userId) {

                this.$http.get('/userAvatar/getAvatarByUserId', {
                    userId: userId
                }, {
                    headers: {
                        'token': this.$store.getters.token
                    }
                }).then((result) => {
                    if (result.data.code = "SUCCESS") {
                        this.hairType = result.data.data.hairType;
                        this.eyebrowType = result.data.data.eyebrowType;
                        this.eyeType = result.data.data.eyeType;
                        this.mouthType = result.data.data.mouthType;
                        this.facialHairType = result.data.data.facialHairType;
                        this.clotheType = result.data.data.clotheType;
                    }
                }).catch((err) => {

                });
            }

        },
        mounted() {
            if (this.$store.getters.user != null) {
                this.getAvatarByUserId(this.$store.getters.user.id);
            }
        }
    }
</script>