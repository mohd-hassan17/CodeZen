"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserRole } from "@/prisma/generated/enums";
import { Menu, X } from "lucide-react";

const Navbar = ({ userRole, isSignedIn }) => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="TreeBio" width={36} height={36} />
            <span className="font-bold text-xl tracking-widest text-amber-300">
              CodeZen
            </span>
          </Link>

          {/* Desktop Links */}
          {isSignedIn && (
          <div className="hidden md:flex items-center gap-x-6">
            <Link href="/problems" className="nav-link">
              Problems
            </Link>
            <Link href="/profile" className="nav-link">
              Profile
            </Link>
          </div>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            <SignedIn>
              {userRole === UserRole.ADMIN && (
                <Link href="/create-problem">
                  <Button variant="outline">Create Problem</Button>
                </Link>
              )}
              <UserButton />
            </SignedIn>

            <SignedOut>
              <SignInButton>
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button size="sm" className="bg-amber-400 text-white">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden px-4 pb-4 space-y-4">
            <Link
              href="/problems"
              onClick={() => setOpen(false)}
              className="block nav-link"
            >
              Problems
            </Link>
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="block nav-link"
            >
              Profile
            </Link>

            <div className="flex items-center gap-3">
              <ModeToggle />
              <SignedIn>
                {userRole === UserRole.ADMIN && (
                  <Link href="/create-problem">
                    <Button variant="outline" size="sm">
                      Create Problem
                    </Button>
                  </Link>
                )}
                <UserButton />
              </SignedIn>

              <SignedOut>
                <SignInButton>
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button size="sm" className="bg-amber-400 text-white">
                    Sign Up
                  </Button>
                </SignUpButton>
              </SignedOut>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
