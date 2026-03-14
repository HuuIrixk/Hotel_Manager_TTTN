import { Link } from 'react-router-dom'

export default function RoomCard({ room, hotel }) {
  return (
    <div
      className="bg-white/10 backdrop-blur-md border border-cyan-400/20 rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.15)]
                 hover:shadow-[0_0_35px_rgba(34,211,238,0.3)] overflow-hidden transition-all duration-500 transform hover:-translate-y-1"
      data-aos="fade-up"
    >
      {/* Ảnh phòng */}
      <div className="h-56 overflow-hidden">
        <img
          src={`/images/${room.id}-1.svg`}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.currentTarget.src = hotel?.image || '/images/fallback-room.jpg'
          }}
        />
      </div>

      {/* Nội dung */}
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 mb-1">
              {hotel?.name}
            </p>
            <h3 className="text-lg font-semibold text-white">
              {room.name}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Giá / đêm</p>
            <p className="text-xl font-bold text-cyan-400">
              ${room.price}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-300 line-clamp-2">
          {room.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <span className="text-xs text-gray-400">
            🛏 {room.beds} • 📏 {room.size}
          </span>
          <Link
            to={`/rooms/${room.id}`}
            className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-semibold rounded-lg
                       hover:scale-105 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all duration-300"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  )
}
