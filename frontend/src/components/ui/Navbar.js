import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <img
                src="/images/logo.png"
                alt="VAA Hotel"
                className="h-12 w-auto"
              />
              <div className="ml-3 text-gray-900">
                <div className="text-lg font-bold leading-none">VAA Hotel</div>
                <div className="text-sm">Saigon Hotel</div>
              </div>
            </Link>
          </div>

          {/* Main Menu (desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Trang Chủ
            </Link>
            <Link
              to="/rooms"
              className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Phòng
            </Link>
            <Link
              to="/dining"
              className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Ẩm Thực
            </Link>
            <Link
              to="/services"
              className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Dịch Vụ
            </Link>
            <Link
              to="/meetings"
              className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Hội Nghị
            </Link>
            <Link
              to="/special-offers"
              className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Ưu Đãi
            </Link>
          </div>

          {/* Auth buttons (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Đăng Nhập
            </Link>
            <Link
              to="/register"
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Đăng Ký
            </Link>
          </div>

          {/* Mobile toggle button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={closeMenu}
              className="block text-gray-700 hover:text-primary px-3 py-2 text-base font-medium"
            >
              Trang Chủ
            </Link>
            <Link
              to="/rooms"
              onClick={closeMenu}
              className="block text-gray-700 hover:text-primary px-3 py-2 text-base font-medium"
            >
              Phòng
            </Link>
            <Link
              to="/dining"
              onClick={closeMenu}
              className="block text-gray-700 hover:text-primary px-3 py-2 text-base font-medium"
            >
              Ẩm Thực
            </Link>
            <Link
              to="/services"
              onClick={closeMenu}
              className="block text-gray-700 hover:text-primary px-3 py-2 text-base font-medium"
            >
              Dịch Vụ
            </Link>
            <Link
              to="/meetings"
              onClick={closeMenu}
              className="block text-gray-700 hover:text-primary px-3 py-2 text-base font-medium"
            >
              Hội Nghị
            </Link>
            <Link
              to="/special-offers"
              onClick={closeMenu}
              className="block text-gray-700 hover:text-primary px-3 py-2 text-base font-medium"
            >
              Ưu Đãi
            </Link>
          </div>

          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5 gap-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="text-gray-700 hover:text-primary px-3 py-2 text-base font-medium"
              >
                Đăng Nhập
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-base font-medium"
              >
                Đăng Ký
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
