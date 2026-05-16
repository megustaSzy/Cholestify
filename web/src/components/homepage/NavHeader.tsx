"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavHeader() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm group/nav">
      <input type="checkbox" id="mobile-menu" className="hidden" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 h-16 flex items-center justify-between">
        <span className="text-3xl font-extrabold text-blue-600 tracking-tight select-none">
          Cholestify
        </span>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Home", href: "/" },
            {
              label: "Food Directory",
              href: "/user/food-table",
            },
            { label: "Eye Scan", href: "/user/eye-scan" },
            { label: "Calculator HDR", href: "/calculator-hdr" },
          ].map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  active
                    ? "text-blue-600 border-b-2 border-blue-600 pb-0.5"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-800 hover:bg-gray-400 hover:text-white transition-colors bg-gray-300 rounded-lg px-4 py-2"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all active:scale-95"
          >
            Get Started
          </Link>
        </div>

        {/* Hamburger Toggle */}
        <label
          htmlFor="mobile-menu"
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
        >
          {/* Hamburger icon — visible by default, hidden when menu open */}
          <svg
            className="w-5 h-5 block group-has-[:checked]/nav:hidden"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          {/* Close icon*/}
          <svg
            className="w-5 h-5 hidden group-has-[:checked]/nav:block"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </label>
      </div>

      {/* Mobile Dropdown Menu*/}
      <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg max-h-0 overflow-hidden opacity-0 group-has-[:checked]/nav:max-h-[32rem] group-has-[:checked]/nav:opacity-100 transition-all duration-300 ease-in-out">
        <div className="px-4 sm:px-6 pb-5 pt-2 flex flex-col gap-2">
          {[
            { label: "Home", href: "/" },
            { label: "Food Directory", href: "/user/food-table" },
            { label: "Eye Scan", href: "/user/eye-scan" },
            { label: "Calculator HDR", href: "/calculator-hdr" },
          ].map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`text-sm font-medium py-3 text-center rounded-lg transition-colors ${
                  active
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <hr className="border-gray-100 my-2" />
          <Link
            href="/login"
            className="text-sm font-medium text-gray-800 hover:bg-gray-400 hover:text-white transition-colors py-2 text-center rounded-lg bg-gray-300"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all active:scale-95 text-center"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
