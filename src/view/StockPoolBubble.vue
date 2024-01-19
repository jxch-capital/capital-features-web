<script setup lang="ts">
import {allStockPoolApi, kDashByPoolApi} from '../api'
import {onMounted, ref} from "vue";
import chroma from 'chroma-js'

const chroma_scale_red_green = chroma.scale(['red', 'gray', 'green'])

function getBackGroundColor(value) {
  return chroma_scale_red_green(value / 20 + 0.5).hex();
}

const option = ref({
  grid: {
    left: '0%',
  },
  tooltip: {
    formatter: function (params) {
      return `${params.marker} ${params.data[3]}</br><table>`
          + `<tr><td>短期</td><td style="background-color: ${getBackGroundColor(params.data[2])}; text-align: right; color: aliceblue">${params.data[2].toFixed(2)}%</td></tr>`
          + `<tr><td>中期</td><td style="background-color: ${getBackGroundColor(params.data[0])}; text-align: right; color: aliceblue">${params.data[0].toFixed(2)}%</div></tr>`
          + `<tr><td>长期</td><td style="background-color: ${getBackGroundColor(params.data[1])}; text-align: right; color: aliceblue">${params.data[1].toFixed(2)}%</td></tr>`
          + `</table>`
    }
  },
  xAxis: {
    boundaryGap: false,
    splitLine: {show: false},
    axisLine: {
      onZero: true,
      lineStyle: {
        type: 'dashed'
      }
    },
    axisLabel: {
      formatter: function (value) {
        return value + '%';
      }
    }
  },
  yAxis: {
    axisLine: {
      onZero: true,
      lineStyle: {
        type: 'dashed'
      }
    },
    axisTick: {show: false},
    splitLine: {show: false},
    scale: true,
    axisLabel: {
      formatter: function (value) {
        return value + '%';
      }
    }
  },
  visualMap: {
    show: false,
    min: -10,
    max: 10,
    dimension: 2,
    inRange: {
      color: ['red', 'gray', 'green']
    }
  },
  series: [
    {
      data: [],
      type: 'scatter',
      symbolSize: function (data) {
        return Math.min(Math.max(Math.abs(data[2]) * 5, 6), 50);
      },
      label: {
        show: true,
        formatter: function (param) {
          return param.data[3] + ' ' + param.data[2].toFixed(2) + '%';
        },
        position: 'top',
        fontSize: 10,
        color: '#fff'
      },
      emphasis: {
        label: {
          show: true
        }
      }
    }
  ]
})
const nodes = ref([])

let param = ref({
  stockPoolId: '',
  poolName: '',
  offset: 120,
  pl: 5,
  xl: 20,
  yl: 40,
})
let queryLoading = ref(false)
let stockPoolMap;
let stockPool = ref([])

const handleSelectStockPool = (key) => {
  param.value.stockPoolId = key
  param.value.poolName = stockPoolMap[key]['poolName']
}

const queryKDashByPool = () => {
  queryLoading.value = true
  kDashByPoolApi(param.value).then(res => {
    nodes.value = res.data
    option.value.series[0].data = res.data.map(item => [item['dxPercent'], item['dyPercent'], item['dpPercent'], item['name'], item['code']]);
  }).finally(() => queryLoading.value = false)
}

const tableEcharts = (closeArr, max, min, yl) => {
  return ref({
    xAxis: {
      show: false,
      type: 'category',
    },
    yAxis: {
      show: false,
      type: 'value',
      max: max,
      min: min,
    },
    grid: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    visualMap: {
      type: 'piecewise',
      show: false,
      dimension: 0,
      seriesIndex: 0,
      pieces: [
        {
          gt: 0,
          lt: closeArr.length - yl,
          color: 'gray'
        },
        {
          gt: closeArr.length - yl,
          color: 'rgba(9,116,203,0.82)'
        }
      ]
    },
    series: [
      {
        data: closeArr,
        type: 'line',
        symbol: 'none',
        itemStyle: {
          color: 'black'
        },
        lineStyle: {
          width: 1
        },
        markPoint: {
          data: [
            {
              type: 'max',
              itemStyle: {
                color: '#00ff00',
              },
              symbol: 'circle',
              symbolSize: 4,
              label: {
                show: false,
              }
            }, {
              type: 'min',
              itemStyle: {
                color: '#ff0000',
              },
              symbol: 'circle',
              symbolSize: 4,
              label: {
                show: false,
              }
            },
          ]
        }
      }
    ]
  })
}

onMounted(() => {
  allStockPoolApi().then(res => {
    stockPool.value = res.data.map((item) => {
      return {
        label: item["poolName"],
        key: item["id"],
      }
    })
    stockPoolMap = res.data.reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {})
    const pool = Object.values(stockPoolMap)[0];
    param.value.stockPoolId = pool['id']
    param.value.poolName = pool['poolName']
    queryKDashByPool()
  })
})
</script>

<template>
  <n-card>
    <n-space justify="space-between">
      <n-form label-placement="left" inline>
        <n-form-item label="股票池：">
          <n-dropdown trigger="hover" :options="stockPool" @select="handleSelectStockPool">
            <n-button>{{ param.poolName }}</n-button>
          </n-dropdown>
        </n-form-item>
        <n-form-item label="偏移天数：">
          <n-input-number v-model:value="param.offset" clearable/>
        </n-form-item>
        <n-form-item label="短期：">
          <n-input-number v-model:value="param.pl" clearable/>
        </n-form-item>
        <n-form-item label="中期：">
          <n-input-number v-model:value="param.xl" clearable/>
        </n-form-item>
        <n-form-item label="长期：">
          <n-input-number v-model:value="param.yl" clearable/>
        </n-form-item>
      </n-form>
      <n-button @click="queryKDashByPool" v-model:loading="queryLoading">查询</n-button>
    </n-space>
  </n-card>
  <n-space justify="space-between">
    <n-card>
      <n-table size="small">
        <n-tr>
          <n-th>No.</n-th>
          <n-th>Code</n-th>
          <n-th>Name</n-th>
          <n-th>Short</n-th>
          <n-th>Middle</n-th>
          <n-th>Long</n-th>
          <n-th>Chart</n-th>
        </n-tr>
        <n-tr v-for="(item, index) in nodes">
          <n-td>{{ index }}</n-td>
          <n-td>{{ item['code'] }}</n-td>
          <n-td>{{ item['name'] }}</n-td>
          <n-td :style="{backgroundColor: getBackGroundColor(item['dpPercent'])}">
            {{item['dpPercent'].toFixed(2) }}%
          </n-td>
          <n-td :style="{backgroundColor: getBackGroundColor(item['dxPercent'])}">
            {{item['dxPercent'].toFixed(2) }}%
          </n-td>
          <n-td :style="{backgroundColor: getBackGroundColor(item['dyPercent'])}">
            {{ item['dyPercent'].toFixed(2) }}%
          </n-td>
          <n-td style="height: 20px; width: 120px">
            <v-echarts :option="tableEcharts(item['closeArr'], item['maxPrice'], item['minPrice'], item['yl']).value"
                       autoresize/>
          </n-td>
        </n-tr>
      </n-table>
    </n-card>
    <n-card style="width: 70vw;height: 100vh;">
      <v-echarts :option="option" autoresize/>
    </n-card>
  </n-space>
</template>

<style scoped>
td {
  white-space: nowrap;
}
</style>