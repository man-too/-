<template>
    <div class="father">
        <h2></h2>   
        <button @click="Count()">加1</button> 
        <children :min="min" :count="count"/>
    </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue'
import children from './children.vue';
    const count=ref(0)
    function Count(){
        count.value+=1
    }
    function min(){
        count.value-=1
    }
    
</script>
<style scoped>
.father{
    background-color: purple;
    padding: 20px;
    box-shadow: 0 0 10px black;
    border-radius: 10px;
}
button{
    height:20px;
    width: 20px;
    padding: auto;
}
</style>