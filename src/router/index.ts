import {createRouter, createWebHistory} from 'vue-router'
import {h, Component} from 'vue'
import {NIcon} from 'naive-ui'
import {
    BookOutline
} from '@vicons/ionicons5'

function renderIcon(icon: Component) {
    return () => h(NIcon, null, {default: () => h(icon)})
}

export const routes = [
    {
        path: '/pa-practice',
        label: "价格行为练习",
        name: 'pa-practice',
        key: 'pa-practice',
        icon: renderIcon(BookOutline),
        component: () => import('../components/HelloWorld.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

export default router
