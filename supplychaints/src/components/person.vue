<template>
    <div class="person">
        <h1>age:</h1>
        <h1>name:</h1>
        <div>
            <button @click="printname">search for name</button>
            <button @click="printage">search for age</button>
            <button @click="changename">change age</button>
        </div>
    </div>
</template>
<script lang="ts">
    import {ref} from 'vue'/*ref定义基本类型*/
    export default{
        name:'person',
        setup(){
            let name=ref("huangzihan")
            let age =ref(14)
            function printname(){
                alert(name.value)
            }
            function printage(){
                alert(age.value)
            }
             function changename(){
                age.value+=1
                alert(age.value)
             }
            return{
                name,age,printname,printage,changename
            }
        }

    }
</script>
<style>
.person{
  display: flex;
  flex-direction: column; 
  justify-content: left; 
  align-items: center; 
  height: 300px;
}
h1{
    size: 20px;
    font-family: "微软雅黑";
    color: black;
}
</style>