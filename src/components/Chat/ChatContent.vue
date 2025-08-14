<template>
  <div class="chat-content">
    <div class="chat-content-header" v-if="selected">
      {{ selected?.name }}
    </div>
    <div class="chat-content-body" v-if="selected">
      <ElScrollbar ref="scrollbarRef"  class="chat-content-body-chat">
        <div
          v-for="message in contentList"
          :key="message.id"
          class="chat-content-body-chat-message"
        >
          <ElAvatar class="chat-content-body-chat-message-avatar" :size="40">
            {{ message.sender }}
          </ElAvatar>
          <div class="chat-content-body-chat-message-text">
            <div v-if="message.file.length > 0">
              <div v-for="file in message.file">
                <div class="chat-content-body-chat-message-text-image" v-if="file.kind === 'image'">
                  <img :src="file.url" :alt="file.name" class="thumb" @click="preview(file.url)" />
                  <div class="meta">
                    <div class="name">{{ file.name }}</div>
                    <div class="size">{{ file.sizeText }}</div>
                  </div>
                </div>
                <!-- 非图片文件考虑下载处理 -->
                <div class="small" v-else>
                  <div class="icon-box" @click="download(file.url)">
                    <ElIcon><Files /></ElIcon>
                  </div>
                  <div class="meta">
                    <div class="name">{{ file.name }}</div>
                    <div class="size">{{ file.sizeText }}</div>
                  </div>
              </div>
              </div>
            </div>
            <span class="chat-content-body-chat-message-text-span">{{ message.content }}</span>
          </div>
        </div>
      </ElScrollbar>
    </div>
    <ElImageViewer v-if="imagePreview.visible" :url-list="[imagePreview.url]" @close="imagePreview.visible=false" />
    <ChatInput v-if="selected" />
  </div>
</template>
<script setup lang="ts">
  import ChatInput from './ChatInput.vue'
  import { useAiStore } from '@/store/index.ts'
  import { storeToRefs } from 'pinia'
  import { ElScrollbar } from 'element-plus'
  const store = useAiStore()
  const { selected, contentList, imagePreview } = storeToRefs(store)
  const { preview, download } = store
  const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

  watch(() => store.contentList.length,async () => {
    console.log('contentList changed, scrolling to bottom');
    await nextTick()
    if (!scrollbarRef.value) return;
    const container = scrollbarRef.value?.$el.querySelector('.el-scrollbar__wrap') as HTMLElement;
    if (container) {
      scrollbarRef.value!.setScrollTop(container.scrollHeight);
    }
  })
</script>
    
<style lang="scss" scoped>
.chat-content {
  flex: 1; 
  background-color: #fff; 
  display: flex;
  flex-direction: column;
  padding: 20px;
  &-header {
    height: 60px; 
    border-bottom: 1px solid #eaebf1; 
    line-height: 60px; 
    font-size: 18px; 
    font-weight: bold;
  }
  &-body {
    flex: 1; 
    overflow-y: auto; 
    padding: 10px;
    &-chat {
      &-message {
        padding: 10px;
        margin-bottom: 10px;
        &-avatar {
          margin-top: 10px;
        }
        &-text {
          padding: 10px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          &-span {
            font-size: 14px;
            background-color: #f5f7fa;
            padding: 10px;
            border-radius: 8px;
            margin-top: 8px;
          }
          &-image {
            display: flex;
          }
          .thumb {
            width: 56px;
            height: 56px;
            border-radius: 8px;
            object-fit: cover;
          }
          .small {
            display: flex;
          }
          .meta { display: flex; flex-direction: column; gap: 2px; }
          .name { font-size: 14px; color: #1f2d3d; }
          .size { font-size: 12px; color: #8f9bb3; }
          .ellipsis {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 180px;
          }
          .icon-box {
            width: 56px;
            height: 56px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #409eff;
            background: #ecf5ff;
          }
        }
      }
    }
  }
}
</style>