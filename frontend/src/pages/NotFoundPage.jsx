// src/pages/NotFoundPage.jsx
import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-5xl font-[Playfair_Display] text-cyan-400 mb-4">
          404
        </h1>
        <p className="text-gray-300 mb-6">
          Trang bạn tìm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-cyan-400 text-black font-semibold rounded-full hover:bg-cyan-300 transition"
        >
          Về trang chủ
        </Link>
      </main>
      <Footer />
    </div>
  )
}
