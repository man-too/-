import {createRouter, createWebHistory} from 'vue-router'
import supply from '../components/供货.vue'
import home from '../components/库存.vue'
import purchase from '../components/采购.vue'
import firstpage from '../components/首页.vue'
import detail from '../components/detail.vue'
const router=createRouter({
    history:createWebHistory(),
    routes:[
            {
            name:'supplys',
            path:'/supply',
            component:supply
           },
           {
            name:'homes',
            path:'/home',
            component:home
           },
           {
            name:'purchases',
            path:'/purchase',
            component:purchase
           },
           {
            name:'firstpages',
            path:'/firstpage',
            component:firstpage,
            children:[{
                name:'details',
                path:'detail/:contact/:phone/:address?',
                component:detail,
                props:true
            }]

            }
           
            ]

})
export default(router)