"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

const Navbar = () => {
  const pathName = usePathname();
  const [path, setPath] = useState('About')

  return (
    <header
      className="fixed left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 items-center justify-between px-4 py-2 text-white mix-blend-difference max-lg:top-2 lg:top-3 sm:px-5"
    >
      <nav aria-label="Main navigation" className="flex w-full items-center justify-between">
        <Link href="/" className="text-sm font-bold tracking-tight sm:text-base">
          Rakibul Islam<span>.</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label }) => (
            <li onClick={()=>setPath(label)} key={href} className={`overflow-hidden rounded-full px-1 py-0.5 transition-colors hover:bg-white/10 ${path === label && "bg-white/5 "}`}>
              <Link
                href={href}
                className={`desktop-link inline-flex rounded-full px-3 py-1 text-sm transition-opacity  ${
                  pathName === href ? "font-semibold" : ""
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open navigation menu"
              className="relative z-10 h-12 w-12 touch-manipulation rounded-full md:hidden"
            >
              <Menu aria-hidden="true" className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[min(20rem,85vw)] border-none bg-slate-800 px-7 pb-8 pt-8 text-white"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation menu</SheetTitle>
              <SheetDescription>Choose a page from the portfolio.</SheetDescription>
            </SheetHeader>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Navigate
            </p>
            <ul className="flex flex-col">
              {links.map(({ href, label }, path) => (
                <li key={href} className="border-b border-white/10">
                  <SheetClose asChild>
                    <Link
                      href={href}
                      className={`mobile-link flex items-center justify-between py-4 text-2xl font-medium tracking-tight transition-colors hover:text-blue-300 ${
                        pathName === href ? "text-blue-300" : "text-white"
                      }`}
                    >
                      <span>{label}</span>
                      <span className="font-mono text-xs text-slate-500">
                        {String(path + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
            <p className="mt-auto text-xs tracking-wide text-slate-400">
              Quality starts with the details.
            </p>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navbar;
