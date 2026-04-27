import { defineStore } from "pinia";
import {ref} from 'vue'
export const useCountstore=defineStore('count',()=>{
  let sum=ref(0);
  function sums(n:number){
    sum.value+=n
  }
  function declease(n:number){
    sum.value-=n
  }
  function clean(){
    sum.value=0
  }
  return {sums,declease,clean,sum}
})