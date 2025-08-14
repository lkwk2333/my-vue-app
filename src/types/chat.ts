export interface AsideList {
  id: number
  name: string
  text: string
}

export interface ChatMessage {
  id: number
  content: string
  sender: 'user' | 'ai',
  file: AttachmentItem[]
}

export interface AttachmentItem {
  id: string
  name: string
  size: number
  sizeText: string
  url: string
  kind: 'image' | 'archive' | 'other'
}
