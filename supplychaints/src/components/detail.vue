<template>
    <div class="u">
        <!-- <ul>
            <li>经理：{{route.params.contact}}</li>
            <li>电话号码:{{route.params.phone}}</li>
            <li>地址:{{route.params.address}}</li>
        </ul> -->
        <ul>
            <li>经理：{{contact}}</li>
            <li>电话号码:{{phone}}</li>
            <li>地址:{{address}}</li>
        </ul>
    </div>
</template>
<script lang="ts" setup>
    // import { useRoute} from 'vue-router';
    // const route=useRoute()
    defineProps(['contact','phone','address'])
</script>
