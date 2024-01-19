<script setup lang="ts">
import {ref} from 'vue'
import {routes} from '../router'
import {useRouter} from "vue-router";

const router = useRouter();

const menuItems = ref(routes);
const collapsed = ref(true)
const activeKey = ref<string | null>(null);
const handleUpdateValue = (key: any, item: any) => {
  router.push({path: key});
};
</script>

<template>
  <n-space vertical>
    <n-layout has-sider class="router-container">
      <n-message-provider>
        <n-notification-provider placement="top-left" :max="5">
          <n-layout-sider
              bordered
              collapse-mode="width"
              :collapsed-width="64"
              :width="240"
              :collapsed="collapsed"
              show-trigger
              @collapse="collapsed = true"
              @expand="collapsed = false"
          >
            <n-menu
                v-model:value="activeKey"
                :collapsed="collapsed"
                :collapsed-width="64"
                :collapsed-icon-size="22"
                :options="menuItems"
                @update:value="handleUpdateValue"
            />
          </n-layout-sider>
          <n-layout>
            <router-view/>
          </n-layout>
        </n-notification-provider>
      </n-message-provider>
    </n-layout>
  </n-space>
</template>

<style scoped>
.router-container {
  width: 100vw;
  height: 100vh;
}
</style>