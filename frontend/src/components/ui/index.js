export function Stars({ value = 4 }) {
  return (
    <div className="flex items-center text-cyan-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < value ? 'opacity-100' : 'opacity-30'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.785.57-1.84-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.06 9.397c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.97z" />
        </svg>
      ))}
    </div>
  )
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = 'px-4 py-2 rounded transition-all duration-150 focus:outline-none focus:ring-2'
  const variants = {
    primary: 'bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-300',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-300',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-200'
  }

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function Input({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-sm text-gray-700 mb-1">{label}</label>}
      <input className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:bg-gray-50" {...props} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
