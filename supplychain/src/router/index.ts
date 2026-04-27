import { createRouter, createWebHistory} from 'vue-router'
import type {RouteRecordRaw } from 'vue-router'
import App from '@/App.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: App,
        children: [
            // {
            //     path: '/',
            //     name: 'Home',
            //     component: () => import('@/views/Home.vue'),
            // },
            {
                path: '/',
                redirect: '/product'
            },
            {
                path: '/login',
                name: 'Login',
                component: () => import('@/views/login.vue'),
            },
            {
                path: '/product',
                name: 'product',
                component: () => import('@/views/product.vue'),
            },
            {
                path: '/categroy',
                name: 'categroy',
                component: () => import('@/views/categroy.vue'),
            },
            {
                path:'/warehouse',
                name:'warehouse',
                component:()=>import('@/views/Warehouse Manage.vue')
            },
            {
                path:'/details',
                name:'details',
                component:()=>import('@/views/Warehouse Details.vue')
            },
            {
                path:'/location',
                name:'location',
                component:()=>import('@/views/Storage Location.vue')
            },
            {
                path:'/stocking',
                name:'stocking',
                component:()=>import('@/views/Stocking.vue')
            },
            {
                path:'/addstocking',
                name:'addstocking',
                component:()=>import('@/views/addstocking.vue')

            }
            
        ]
    }
]
const router=createRouter({ history: createWebHistory(), routes })
export default router