<template>
    <div class="su">
       
         <ul>
            
            <li v-for="item in imformation" :key="item.id">
                <button @click="userouter(imformation)">点击</button>
                    <router-link :to="{
                        name:'details',
                        params:{
                            contact:item.contact,
                            phone:item.phone,
                            address:item.address,
                                }
                        }">
                        {{item.name}}
                    </router-link>
            </li>
        </ul>
        <router-view></router-view>
    </div>
</template>
<script lang="ts" setup>
import { RouterLink,useRouter} from 'vue-router';
import {reactive} from 'vue';
const router=useRouter()

let imformation=reactive([
     {
    id: 1,
    name: '鑫源食品有限公司',
    contact: '张经理',
    phone: '13800000001',
    address: '北京市朝阳区XX路18号'
  },
  {
    id: 2,
    name: '华丰电子科技',
    contact: '李经理',
    phone: '13800000002',
    address: '上海市浦东新区XX园区'
  },
  {
    id: 3,
    name: '宏达建材集团',
    contact: '王经理',
    phone: '13800000003',
    address: '广州市天河区XX路22号' 
  }
])
// interface imformationinter{
//     id:string,
//     name:string,
//     contact:string,
//     phone:string,
//     address:string,
//     [ReactiveMarker]?: boolean;
// }
function userouter(imformation:any){
    router.push(
        {
            name:'details',
            params:{
                contact:imformation.contact,
                phone:imformation.phone,
                address:imformation.address,

            }
        }
    )
}
</script>
<style>
li{
    color: black;
}
</style>
