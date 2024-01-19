import {createRouter, createWebHistory} from 'vue-router'
import {h, Component} from 'vue'
import {NIcon} from 'naive-ui'
import {HeatMap03, ChartBubble} from '@vicons/carbon'
import {AttachMoneyFilled} from '@vicons/material'

function renderIcon(icon: Component) {
    return () => h(NIcon, null, {default: () => h(icon)})
}

export const routes = [
    {
        path: '/',
        label: "About",
        name: 'about',
        redirect: '/stock-pool-bubble',
        icon: renderIcon(AttachMoneyFilled),
        component: () => import('../view/About.vue'),
    }, {
        path: '/stock-pool-bubble',
        label: "市场气泡图",
        name: 'stock-pool-bubble',
        key: 'stock-pool-bubble',
        icon: renderIcon(ChartBubble),
        component: () => import('../view/StockPoolBubble.vue'),
    }, {
        path: '/market-heatmap',
        label: "市场热力图",
        name: 'market-heatmap',
        key: 'market-heatmap',
        icon: renderIcon(HeatMap03),
        component: () => import('../view/MarketHeatmap.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

export default router
