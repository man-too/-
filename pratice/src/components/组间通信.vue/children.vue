<template>
    <div class="child">
        <h2>当前数字：{{props.count}}</h2>
        <button @click="min">减1</button>    
    </div>
</template>
<script lang="ts" setup>
    const props = defineProps(["min","count"])
</script>
<style scoped>
.child{
    background-color: aqua;
    padding: 10px;
    box-shadow: 0 0 10px black;
    border-radius: 10px;
}
button{
    height:20px;
    width: 20px;
    padding: auto;
}
</style>