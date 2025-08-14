<template>
  <div class="chat-aside">
    <ElScrollbar>
        <div
          v-for="item in asideList"
          :key="item.id"
          class="aside-item"
          :class="{ active: selected?.id === item.id }"
          @click="selectNode(item)"
        >
          <div class="avatar-wrapper">
            <ElAvatar :size="40">
              {{ item.name.charAt(0) }}
            </ElAvatar>
          </div>
          <div class="aside-info">
            <div class="info-top">
              <span class="aside-name">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </ElScrollbar>
  </div>
</template>
<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useAiStore } from '@/store/index.ts'
  const store = useAiStore()
  const { asideList, selected  } = storeToRefs(store)
  const { selectNode } = store
</script>
    
<style lang="scss" scoped>
.chat-aside {
  width: 300px; 
  height: 100%;
  padding: 20px;
  background-color: #f0f0f0;
  border-right: 1px solid #eaebf1;
  .aside-item {
    display: flex;
    align-items: center;
    padding: 12px;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.3s ease;
    &:hover,
    &.active {
      background-color: #f5f7fa;
    }
    .avatar-wrapper {
      position: relative;
      margin-right: 12px;
    }
    .aside-info {
      flex: 1;
      min-width: 0;
      .info-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 4px;
        .aside-name {
          font-size: 14px;
          font-weight: 500;
          color: #303133;
        }
      }
    }
  }
}
</style>