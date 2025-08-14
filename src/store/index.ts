import { defineStore } from 'pinia'
import type { AsideList, ChatMessage, AttachmentItem } from '../types/chat.ts';
const typeWriter = (text = '',elemnt:ChatMessage, speed = 100) => {
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      elemnt.content += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
}
const aiText = '对不起，我是个智障，我无法回答你的问题,请转人工咨询聪明的阿宽'
export const useAiStore = defineStore('aiStore', () => {
  const asideList = ref<AsideList[]>([{
    id: 1,
    name: 'AI测试助手',
    text: 'AITest',
  }, {
    id: 2,
    name: 'AI报文校验',
    text: 'AICheck',
  }, {
    id: 3,
    name: 'AI报文生成',
    text: 'AIGenerate',
  }]);

  const selected = ref<AsideList | null>(null);

  const selectNode = (item: AsideList) => {
    console.log('Selected:', item);
    selected.value = item;
  };

  const contentList = ref<ChatMessage[]>([
    { id: 1, content: '你好，我是AI助手，请问有什么可以帮助你的？', sender: 'ai', file:[] },
  ]);

  const sendMessage = () => {
    if (!text.value.trim()) {
      return; // 如果输入为空，则不发送消息
    }
    contentList.value.push({
      id: contentList.value.length + 1,
      content: text.value,
      sender: 'user',
      file: attachmentList.value,
    });
    attachmentList.value = []
    text.value = ''

    contentList.value.push({
      id: contentList.value.length + 1,
      content: text.value,
      sender: 'ai',
      file: attachmentList.value,
    });
    typeWriter(aiText,contentList.value[contentList.value.length-1])
  };

  const attachmentList = ref<AttachmentItem[]>([]);

  const addAttachmentItem = (item: AttachmentItem) => {
    attachmentList.value.push(item);
  };

  const imagePreview = reactive<{ visible: boolean; url: string }>({ visible: false, url: '' })

  const preview = (url: string) => {
    imagePreview.url = url
    imagePreview.visible = true
  }

  const download = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const removeAttachmentItem = (id: string) => {
    attachmentList.value = attachmentList.value.filter(item => item.id !== id);
  };

  const text = ref('');
  return {
    asideList,
    selected,
    contentList,
    attachmentList,
    imagePreview,
    text,
    selectNode,
    addAttachmentItem,
    sendMessage,
    preview,
    removeAttachmentItem,
    download,
  }
})