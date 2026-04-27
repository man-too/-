<template>
    <div class="n1">
      <h1>{{usecounter.sum}}</h1>
      <select v-model.number="n" name="choose" id="chose">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      <button @click="usecounter.sums(n)">加</button>
      <button @click="usecounter.declease(n)">减</button>
      <button @click="usecounter.clean()">清空</button>
    </div>
</template>
<script lang="ts" setup>
import { useCountstore } from '../store/count';
  import {ref} from 'vue'
  const usecounter=useCountstore()
  let n=ref(1)
</script>
<style scoped></style>