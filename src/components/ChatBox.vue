<template>
  <div class="chat-wrapper">
    <!-- 消息列表 -->
    <el-scrollbar class="chat-list">
      <div v-for="msg in messages" :key="msg.id" class="chat-item">
        <div class="bubble">
          <div v-if="msg.attachments.length" class="attachments">
            <div
              v-for="file in msg.attachments"
              :key="file.id"
              class="attachment-chip"
              :class="{
                image: file.kind === 'image',
                archive: file.kind === 'archive'
              }"
            >
              <template v-if="file.kind === 'image'">
                <img :src="file.url" :alt="file.name" class="thumb" @click="preview(file.url)" />
                <div class="meta">
                  <div class="name">{{ file.name }}</div>
                  <div class="size">{{ file.sizeText }}</div>
                </div>
              </template>
              <template v-else>
                <div class="icon-box">
                  <el-icon><Files /></el-icon>
                </div>
                <div class="meta">
                  <div class="name">{{ file.name }}</div>
                  <div class="size">{{ file.sizeText }}</div>
                </div>
              </template>
            </div>
          </div>
          <div v-if="msg.text" class="text">{{ msg.text }}</div>
        </div>
      </div>
    </el-scrollbar>

    <!-- 输入区 -->
    <div class="composer">
      <div class="attachments-row" v-if="draft.attachments.length">
        <div
          v-for="file in draft.attachments"
          :key="file.id"
          class="attachment-chip small"
          :class="{ image: file.kind === 'image', archive: file.kind === 'archive' }"
        >
          <template v-if="file.kind === 'image'">
            <img :src="file.url" :alt="file.name" class="thumb" />
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
          <el-icon class="remove" @click="removeDraftFile(file.id)"><Close /></el-icon>
        </div>
      </div>

      <div class="composer-row">
        <el-input
          v-model="draft.text"
          class="input"
          :placeholder="placeholder"
          type="textarea"
          :rows="3"
          resize="none"
        />
        <div class="toolbar">
          <el-upload
            :auto-upload="false"
            :show-file-list="false"
            multiple
            accept="image/*,.zip,.rar,.7z,.tar,.gz,.bz2,.xz,.xml"
            :on-change="onDraftFilesChange"
          >
            <el-button text :icon="Paperclip">附件</el-button>
          </el-upload>
          <el-button type="primary" :icon="Promotion" @click="send" :disabled="isSendDisabled">发送</el-button>
        </div>
      </div>
    </div>

    <!-- 图片预览 -->
    <el-image-viewer v-if="imagePreview.visible" :url-list="[imagePreview.url]" @close="imagePreview.visible=false" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { Close, Files, Promotion, Paperclip } from '@element-plus/icons-vue'

interface AttachmentItem {
  id: string
  name: string
  size: number
  sizeText: string
  url: string
  kind: 'image' | 'archive' | 'other'
}

interface MessageItem {
  id: string
  text: string
  attachments: AttachmentItem[]
}

const props = defineProps<{ placeholder?: string }>()
const placeholder = computed(() => props.placeholder ?? '输入消息，支持图片/压缩包...')

const messages = ref<MessageItem[]>([])

const draft = reactive<{ text: string; attachments: AttachmentItem[] }>({
  text: '123232323232',
  attachments: []
})

const imagePreview = reactive<{ visible: boolean; url: string }>({ visible: false, url: '' })

function preview(url: string) {
  imagePreview.url = url
  imagePreview.visible = true
}

function formatSize(size: number): string {
  if (size < 1024) return `${size}B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)}KB`
  return `${(size / 1024 / 1024).toFixed(1)}MB`
}

function classifyKind(name: string, type: string): AttachmentItem['kind'] {
  const lower = name.toLowerCase()
  if (type.startsWith('image/') || /(png|jpg|jpeg|gif|webp|bmp|svg)$/.test(lower)) return 'image'
  if (/(zip|rar|7z|tar|gz|bz2|xz)$/.test(lower)) return 'archive'
  return 'other'
}

function onDraftFilesChange(file: any) {
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
  draft.attachments.push(item)
}

function removeDraftFile(id: string) {
  const idx = draft.attachments.findIndex(a => a.id === id)
  if (idx >= 0) draft.attachments.splice(idx, 1)
}

const isSendDisabled = computed(() => !draft.text.trim() && draft.attachments.length === 0)

function send() {
  if (isSendDisabled.value) return
  messages.value.push({
    id: `${Date.now()}`,
    text: draft.text.trim(),
    attachments: [...draft.attachments]
  })
  draft.text = ''
  draft.attachments = []
}
</script>

<style scoped>
.chat-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.chat-list {
  flex: 1;
  padding: 16px 20px;
}

.chat-item {
  display: flex;
  margin-bottom: 16px;
}

.bubble {
  background: #fff;
  border: 1px solid #e5eaf3;
  border-radius: 10px;
  padding: 12px;
  max-width: 720px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.attachments {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  margin-bottom: 8px;
}

.attachment-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #e5eaf3;
  border-radius: 10px;
  padding: 10px;
  background: #fff;
}

.attachment-chip.image .thumb {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
}

.attachment-chip.small .thumb {
  width: 40px;
  height: 40px;
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

.attachment-chip.small .icon-box { width: 40px; height: 40px; }

.meta { display: flex; flex-direction: column; gap: 2px; }
.name { font-size: 14px; color: #1f2d3d; }
.size { font-size: 12px; color: #8f9bb3; }

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px;
}

.text { font-size: 14px; color: #1f2d3d; }

.composer {
  border-top: 1px solid #e5eaf3;
  background: #fff;
}

.attachments-row {
  padding: 10px 12px 0 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.attachment-chip.small {
  padding: 8px;
}

.attachment-chip .remove {
  margin-left: auto;
  color: #a8abb2;
  cursor: pointer;
}
.attachment-chip .remove:hover { color: #606266; }

.composer-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  padding: 12px;
}

.input :deep(textarea) {
  border-radius: 8px;
}

.toolbar {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
</style>
