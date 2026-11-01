import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Globe,
} from "lucide-react";

function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-40 flex h-[72px] min-w-0 items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 sm:px-4 md:px-6">

      {/* Left Section */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">

        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-xl font-bold text-white">
            দ
          </div>

          <div>
            <h1 className="text-lg font-bold text-teal-800 sm:text-xl">
              Disha
            </h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              Your Career Companion
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mx-3 hidden min-w-0 max-w-md flex-1 md:flex lg:mx-6">
        <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
          <Search size={18} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search careers, skills, courses..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-3">

        <button className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 sm:flex">
          <Globe size={18} />
          English
          <ChevronDown size={15} />
        </button>

        <button
          className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell size={21} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 font-semibold text-teal-800">
            U
          </div>

          <ChevronDown size={16} className="hidden text-slate-500 sm:block" />
        </button>

      </div>
    </header>
  );
}

export default Navbar;
