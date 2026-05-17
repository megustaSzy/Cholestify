export const footerLinks = [
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "User Research",
    href: "/user-research",
  },
  {
    label: "Terms of Service",
    href: "/terms",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

import Link from "next/link";
import React from "react";
import { IconLinkedin, IconTwitter } from "../Icon";

export default function FooterForm() {
  return (
    <footer className="border-t border-gray-100 bg-white px-4 sm:px-6 lg:px-16 py-7">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="text-center sm:text-left">
          <span className="text-lg font-extrabold text-blue-600">
            Cholestify
          </span>
          <p className="text-[11px] text-gray-400 mt-1">
            © 2026 Cholestify. Clinical Monitor.
          </p>
        </div>
        <div className="flex justify-center sm:flex-1">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 sm:gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href="#"
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            <IconTwitter />
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            <IconLinkedin />
          </Link>
        </div>
      </div>
    </footer>
  );
}
