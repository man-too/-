<template>
    <div class="car">
        <h3>品牌：{{car.brand}}</h3>
        <h3>价格：{{car.prize}}</h3>
        <button @click="change">change</button>
    </div>
</template>
<script lang="ts">
     import { reactive,ref} from 'vue';
     export default{
        name:'huang',
        setup() {
            let car=reactive({
                brand:'奔驰',
                prize:30
            })
            let a=ref(0)
            function change(){
                a.value++
                if(a.value%2!=1){
                car.brand='宝马';
                car.prize=40}
                else{
                  car.brand = '奔驰';
                  car.prize = 30;
                 }
        }
            
            return{change,car}}
            
        }
        
</script>
<style>
.car{
  display: flex;
  flex-direction: column; 
  justify-content: left; 
  align-items: center; 
  height: 300px;
}
h3{
    size: 20px;
    font-family: "微软雅黑";
    color: black;
}
</style>