// src/features/chat/ChatWidget.jsx
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/features/auth/AuthProvider'
import { useTheme } from '@/features/theme/ThemeProvider'
import { sendChatMessage } from '@/api/chatApi'

// OLD: dùng để lưu localStorage – giờ bỏ
// const STORAGE_MESSAGES_KEY = 'hotel_chat_messages_v1'
// const STORAGE_OPEN_KEY = 'hotel_chat_open_v1'

const INITIAL_BOT_MESSAGE = {
  id: 1,
  sender: 'bot',
  text: 'Xin chào! Mình là trợ lý ảo của VAA Hotel. Bạn cần hỗ trợ gì về đặt phòng, giá phòng hoặc tiện ích khách sạn không?',
}

// parse markdown link [text](/booking?...)
function renderMessageText(raw, onLinkClick) {
  if (raw == null) return null

  const text = String(raw)

  // 1) dọn bớt markdown cơ bản cho đỡ xấu
  const cleaned = text
    // bỏ các heading ##, ###, # ở đầu dòng
    .replace(/^###\s+/gm, '')
    .replace(/^##\s+/gm, '')
    .replace(/^#\s+/gm, '')
    // bỏ **bold**
    .replace(/\*\*(.+?)\*\*/g, '$1')

  // 2) parse link markdown [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const parts = []
  let lastIndex = 0
  let match

  while ((match = linkRegex.exec(cleaned)) !== null) {
    if (match.index > lastIndex) {
      parts.push(cleaned.slice(lastIndex, match.index))
    }

    const [, linkText, href] = match
    const isInternal = href.startsWith('/')

    parts.push(
      isInternal ? (
        <button
          key={parts.length}
          type="button"
          onClick={() => onLinkClick(href)}
          className="text-cyan-500 hover:text-cyan-400 underline underline-offset-2"
        >
          {linkText}
        </button>
      ) : (
        <a
          key={parts.length}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-cyan-500 hover:text-cyan-400 underline underline-offset-2"
        >
          {linkText}
        </a>
      )
    )

    lastIndex = linkRegex.lastIndex
  }

  if (lastIndex < cleaned.length) {
    parts.push(cleaned.slice(lastIndex))
  }

  // nếu không có link nào thì trả string
  return parts.length ? parts : cleaned
}


export default function ChatWidget() {
  const { user } = useAuth() || {}
  const { theme } = useTheme() || {}
  const isDark = theme === 'dark'

  const navigate = useNavigate()
  const messagesEndRef = useRef(null)

  // lấy messages từ localStorage
  // const [messages, setMessages] = useState(() => {
  //   try {
  //     const saved = localStorage.getItem(STORAGE_MESSAGES_KEY)
  //     if (saved) return JSON.parse(saved)
  //   } catch (e) {
  //     console.error('Lỗi đọc lịch sử chat:', e)
  //   }
  //   return [INITIAL_BOT_MESSAGE]
  // })

  // chỉ giữ trong RAM – reload là reset, chuyển route vẫn giữ
  const [messages, setMessages] = useState([INITIAL_BOT_MESSAGE])

  // isOpen cũng lưu localStorage
  // const [isOpen, setIsOpen] = useState(() => {
  //   try {
  //     const saved = localStorage.getItem(STORAGE_OPEN_KEY)
  //     if (saved === 'true') return true
  //   } catch (e) {
  //     console.error('Lỗi đọc trạng thái mở chat:', e)
  //   }
  //   return false
  // })

  // trạng thái mở chat chỉ sống trong phiên hiện tại
  const [isOpen, setIsOpen] = useState(false)

  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  // lưu messages vào localStorage
  // useEffect(() => {
  //   try {
  //     localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(messages))
  //   } catch (e) {
  //     console.error('Lỗi lưu lịch sử chat:', e)
  //   }
  // }, [messages])

  // lưu trạng thái mở vào localStorage
  // useEffect(() => {
  //   try {
  //     localStorage.setItem(STORAGE_OPEN_KEY, isOpen ? 'true' : 'false')
  //   } catch (e) {
  //     console.error('Lỗi lưu trạng thái chat:', e)
  //   }
  // }, [isOpen])

  // auto scroll xuống cuối khi có tin mới
  useEffect(() => {
    if (!isOpen) return

    const el = messagesEndRef.current
    if (!el) return

    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'auto', block: 'end' })
    })
  }, [messages, isOpen])


  const handleToggleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  const handleResetChat = () => {
    setMessages([INITIAL_BOT_MESSAGE])
    setInput('')
  }

  const handleLinkClick = (href) => {
    // điều hướng nội bộ (booking, search, user...)
    if (href.startsWith('/')) {
      navigate(href)
      return
    }
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || sending) return

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setSending(true)

    // placeholder bot đang gõ
    const typingId = Date.now() + 1
    setMessages((prev) => [
      ...prev,
      {
        id: typingId,
        sender: 'bot',
        text: 'Đang soạn trả lời...',
        typing: true,
      },
    ])

    try {
      const payload = {
        message: trimmed,
        userId: user?.id || null,
        accessToken: user?.token || null,
      }

      const res = await sendChatMessage(payload)
      const botText =
        res?.answer ||
        res?.data?.answer ||
        'Xin lỗi, hiện tại mình không trả lời được. Bạn thử lại sau nhé.'

      setMessages((prev) =>
        prev
          .filter((m) => m.id !== typingId)
          .concat({
            id: Date.now() + 2,
            sender: 'bot',
            text: botText,
          })
      )
    } catch (err) {
      console.error('Lỗi gửi chat:', err)
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== typingId)
          .concat({
            id: Date.now() + 3,
            sender: 'bot',
            text:
              'Xin lỗi, hệ thống đang gặp lỗi khi kết nối tới máy chủ. Bạn thử lại sau một lúc nhé.',
          })
      )
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Nút mở/đóng floating */}
      <button
        type="button"
        onClick={handleToggleOpen}
        className={
          'fixed bottom-4 right-4 z-40 rounded-full px-4 py-2 text-sm font-semibold shadow-lg transition ' +
          (isDark
            ? 'bg-cyan-500 text-black hover:bg-cyan-400'
            : 'bg-cyan-500 text-black hover:bg-cyan-400')
        }
      >
        {isOpen ? 'Đóng chat' : 'Chat với lễ tân AI'}
      </button>

      {/* Khung chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 w-[360px] max-w-[calc(100vw-32px)] rounded-2xl shadow-2xl border border-slate-200 bg-white overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-900 text-slate-50">
            <div>
              <p className="text-sm font-semibold">
                Trợ lý AI – VAA Hotel
              </p>
              <p className="text-[11px] text-slate-300">
                Hỗ trợ đặt phòng, giá, tiện ích 24/7
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetChat}
                className="text-[11px] text-slate-300 hover:text-rose-400 underline underline-offset-2"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleToggleOpen}
                className="text-slate-300 hover:text-slate-100 text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 px-3 py-3 overflow-y-auto bg-slate-50"
            style={{ maxHeight: '420px', height: '420px' }}
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user'
              return (
                <div
                  key={msg.id}
                  className={
                    'mb-2 flex ' + (isUser ? 'justify-end' : 'justify-start')
                  }
                >
                  <div
                    className={
                      'max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ' +
                      (isUser
                        ? 'bg-cyan-500 text-black rounded-br-sm'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-sm')
                    }
                  >
                    {msg.typing
                      ? 'Đang soạn trả lời...'
                      : renderMessageText(msg.text, handleLinkClick)}
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 bg-white px-3 py-2">
            <div className="flex items-end gap-2">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 resize-none rounded-xl text-black border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400"
                placeholder="Nhập câu hỏi của bạn..."
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={sending || !input.trim()}
                className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Gửi
              </button>
            </div>
            <p className="mt-1 text-[10px] text-slate-400">
              Lưu ý: Trợ lý chỉ trả lời các nội dung liên quan đến khách sạn.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
