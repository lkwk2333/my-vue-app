<template>
  <div class="chat-input">
    <div class="chat-input-header">
      <div class="chat-input-header-list" v-if="attachmentList.length">
        <div
          v-for="file in attachmentList"
          :key="file.id"
          class="chat-input-header-list-image"
        >
          <template v-if="file.kind === 'image'">
            <img :src="file.url" :alt="file.name" class="chat-input-header-list-image-thumb" />
            <div class="meta">
              <div class="name ellipsis">{{ file.name }}</div>
              <div class="size">{{ file.sizeText }}</div>
            </div>
          </template>
          <template v-else>
            <div class="icon-box">
              <el-icon><Files /></el-icon>
            </div>
            <div class="meta">
              <div class="name ellipsis">{{ file.name }}</div>
              <div class="size">{{ file.sizeText }}</div>
            </div>
          </template>
          <el-icon class="remove" @click="removeAttachmentItem(file.id)"><Close /></el-icon>
        </div>
      </div>
    </div>
    <div class="chat-input-content">
      <ElInput
        v-model="text"
        type="textarea"
        placeholder="Type your message here..."
        :rows="3"
        @keyup.enter.exact.prevent="sendMessage"
      />
    </div>
    <div class="chat-input-footer">
      <ElUpload
        :auto-upload="false"
        :show-file-list="false"
        multiple
        accept="image/*,.zip,.rar,.7z,.tar,.gz,.bz2,.xz,.xml"
        :on-change="onFilesChange"
      >
        <ElIcon>
          <Link />
        </ElIcon>
      </ElUpload>
      <ElButton type="primary" @click="sendMessage">Send</ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { AttachmentItem } from '@/types/chat.ts'
  import { useAiStore } from '@/store/index.ts'
  import { storeToRefs } from 'pinia'

  const store = useAiStore()
  const { attachmentList , text } = storeToRefs(store)

  const { sendMessage,addAttachmentItem,removeAttachmentItem } = store

  const formatSize = (size: number) => {
    if (size < 1024) return `${size}B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)}KB`
    return `${(size / 1024 / 1024).toFixed(1)}MB`
  }

  const classifyKind = (name: string, type: string) => {
    const lower = name.toLowerCase()
    if (type.startsWith('image/') || /(png|jpg|jpeg|gif|webp|bmp|svg)$/.test(lower)) return 'image'
    if (/(zip|rar|7z|tar|gz|bz2|xz)$/.test(lower)) return 'archive'
    return 'other'
  }

  const onFilesChange = (file: any) => {
    
    // Element Plus on-change 事件会传入当前文件与文件列表，但我们只需要 file.raw
    const raw: File | undefined = file?.raw
    if (!raw) return

    const url = URL.createObjectURL(raw)
    const item: AttachmentItem = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: raw.name,
      size: raw.size,
      sizeText: formatSize(raw.size),
      url,
      kind: classifyKind(raw.name, raw.type)
    }
    addAttachmentItem(item)
  }

</script>

<style lang="scss" scoped>
.chat-input {
  max-height: 240px;
  min-height: 100px;
  padding: 20px;
  border: 1px solid #eaebf1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  color: #606266;
  border-radius: 10px;
  &-header {
    width: 100%;
    max-height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      &-image {
        display: flex;
        align-items: center;
        justify-content: center;
        &-thumb {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 4px;
        }
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
      .remove {
        margin-left: auto;
        color: #a8abb2;
        cursor: pointer;
        &:hover { color: #606266; }
      }
    }
  }
  &-content {
    flex: 1;
    width: 100%;
    padding: 10px;
    overflow-y: auto;
    :deep(.el-textarea__inner) {
      border: none !important;
      box-shadow: none !important;
      resize: none; /* 禁止用户调整大小 */
      overflow: auto;
    }
  }
  &-footer {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: end;
    justify-content: space-between;
  }
}
</style>
