<template>
    <div>
        <ul>
            <li>品牌：{{brand}}</li>
            <li>价格:{{prize}}</li>
            <li>内存：{{store}}G</li>
        </ul>
        <button @click="change1">改变价格</button>
        <button @click="change2">改变内存</button>
    </div>
</template>
<script lang="ts">
    import {watch,ref} from 'vue'
    export default{
        name:"phone",
        setup(){
            let brand=ref('oppo x30pro')
            let prize=ref(3000)
            let store=ref(8)
            function change1(){
                prize.value+=1000
            }
            function change2(){
                store.value+=4
            }
            watch(
      [() => prize.value, () => store.value], // 第一个参数：要监听的两个数据源
      ([newprize, newstore]) => { // 第二个参数：回调函数
        if (newprize >5000) {
          alert('这已经是最高价格了')
          prize.value = 5000 // 修改原 ref 变量，必须加 .value
        }
        if (newstore > 32) {
          alert('没有更大的内存了')
          store.value = 32 // 修改原 ref 变量，必须加 .value
        }
      }
      // 第三个参数（可选）：{ deep: true, immediate: true }
    )

            return{brand,prize,store,change1,change2}

            

            
        }
        
    }
</script>
<style>
div{
  display: flex;
  flex-direction: column; 
  justify-content: left; 
  align-items: center; 
  height: 300px;
}
li{
    size: 20px;
    font-family: "微软雅黑";
    color: black;
}
</style>