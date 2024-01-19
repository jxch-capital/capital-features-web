<script setup lang="ts">
import {heatmapTableApi} from '../api'
import {onMounted, ref} from "vue";
import chroma from 'chroma-js'

const chroma_scale_red_green = chroma.scale(['red', 'gray', 'green'])
const color = (value) => {
  if (!isNaN(value)) {
    return chroma_scale_red_green(value / 100).hex()
  } else {
    return ''
  }
}

let queryLoading = ref(false);
let length = ref(90);
let heatmapTable = ref([]);
const queryHeatmapTable = () => {
  queryLoading.value = true
  heatmapTableApi({length: length.value}).then(res => {
    heatmapTable.value = res.data
  }).finally(() => {
    queryLoading.value = false
  })
}

onMounted(() => {
  queryHeatmapTable()
})

</script>

<template>
  <n-card>
    <n-space justify="space-between">
      <n-form label-placement="left" inline>
        <n-form-item label="日期长度：">
          <n-input-number v-model:value="length" clearable style="text-align: left"/>
        </n-form-item>
      </n-form>
      <n-button @click="queryHeatmapTable" v-model:loading="queryLoading">查询</n-button>
    </n-space>
  </n-card>
  <table style="border-spacing: 0;">
    <tr v-for="line in heatmapTable">
      <td v-for="item in line" :style="{backgroundColor: color(item)}">{{ item }}</td>
    </tr>
  </table>
</template>

<style scoped>

</style>