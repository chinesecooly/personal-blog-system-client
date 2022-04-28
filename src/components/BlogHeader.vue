<template>
    <div id="blogHead">
        <div v-for="item in 156" :key="item" :id="'hi'+item">
        </div>
    </div>
</template>

<style>
    #blogHead {
        cursor: pointer;
        background-image: url('../assets/imgs/blog-header-img.png');
        background-repeat: no-repeat;
        background-size: cover;
        display: grid;
        grid-template-columns: auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto;
        padding: 0;
        /* margin-top: 55px; */
        color: wheat;
        height: 290px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        margin-bottom: 40px;
        width: 100%;
    }

    #blogHead div {
        transition: box-shadow 1s;
    }

    #blogHead div:hover {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
</style>