"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, UserPlus, LogIn } from "lucide-react";

// Navigation links for blog
const blogNavigationLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/blog/dashboard", label: "Dashboard" },
  { href: "/blog/listposts", label: "Lista de Post" },
  { href: "/blog/listcategories", label: "Lista de Categorías" },
];

export default function BlogNavbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const getActive = (href: string) => {
    if (href === "/blog") {
      return pathname === "/blog" || pathname.startsWith("/blog/post");
    }
    if (href === "/blog/dashboard") {
      return pathname === "/blog/dashboard";
    }
    if (href === "/blog/createpost/new") {
      return pathname.startsWith("/blog/createpost");
    }
    return false;
  };

  return (
    <header className="fixed absolute mx-auto max-w-5xl rounded-full top-8 left-0 right-0 z-20 px-4 md:px-6 bg-black/20 backdrop-blur-lg bg-white/5 border border-white/10">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {blogNavigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <NavigationMenuLink
                        asChild
                        className="py-1.5"
                        active={getActive(link.href)}
                      >
                        <Link href={link.href}>{link.label}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-primary hover:text-primary/90">
              <Image src="/devtalles2.png" alt="Logo" width={30} height={30} />
            </Link>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {blogNavigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      asChild
                      active={getActive(link.href)}
                      className=""
                    >
                      <Link href={link.href}>{link.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Botones para usuarios autenticados */}
          {isAuthenticated && (
            <>
              <Button asChild variant="ghost">
                <Link href="/blog/createpost/new">Crear Post</Link>
              </Button>

              {/* Menu de usuario */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <User size={16} />
                    <span className="hidden md:inline">
                      {user?.name || user?.email || "Usuario"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-48 p-1">
                  <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium">
                      {user?.name || "Usuario"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      onClick={logout}
                      disabled={isLoading}
                    >
                      <LogOut size={16} className="mr-2" />
                      Cerrar Sesión
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}

          {/* Botones para usuarios no autenticados */}
          {!isAuthenticated && !isLoading && (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/blog/login" className="flex items-center gap-2">
                  <LogIn size={16} />
                  <span className="hidden md:inline">Iniciar Sesión</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/blog/signup" className="flex items-center gap-2">
                  <UserPlus size={16} />
                  <span className="hidden md:inline">Registrarse</span>
                </Link>
              </Button>
            </>
          )}

          <Button asChild variant={"ghost"}>
            <Link href="/">Landing</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
