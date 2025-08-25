// === File: src/components/Header.jsx ===
export default function Header({ sidebarPx, onToggleSidebar }) {
    return (
      <header
        className="fixed top-0 left-0 right-0 text-white shadow-lg z-40 transition-all duration-300 bg-gradient-to-br from-gray-800 to-gray-700"
        style={{ paddingLeft: sidebarPx }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-600/60 transition-colors"
              aria-label="Alternar sidebar"
            >
              <i className="fas fa-bars text-xl" />
            </button>
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <i className="fas fa-bell text-xl hover:text-gray-300 cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-sm" />
              </div>
              <span className="text-sm">Admin</span>
            </div>
          </div>
        </div>
      </header>
    );
  }