<template>
  <div class="chat-container">
    <ChatAside />
    <ChatContent />
  </div>
</template>

<script setup lang="ts">
import ChatAside from './ChatAside.vue'
import  ChatContent from './ChatContent.vue'
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  height: 100%;
}
</style>
