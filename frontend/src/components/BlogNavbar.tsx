'use client';

import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

// Navigation links for blog
const blogNavigationLinks = [
    { href: '/landing', label: 'Landing' },
    { href: '/blog', label: 'Blog' },
    { href: '/blog/dashboard', label: 'Dashboard', rol: ['ADMIN'] },
    { href: '/blog/listposts', label: 'Lista de Post', rol: ['ADMIN'] },
    {
        href: '/blog/listcategories',
        label: 'Lista de Categorías',
        rol: ['ADMIN'],
    },
];

export default function BlogNavbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const getActive = (href: string) => {
        if (href === '/landing') {
            return pathname === '/landing' || pathname === '/';
        }

        if (href === '/blog') {
            return pathname === '/blog' || pathname.startsWith('/blog/post');
        }
        if (href === '/blog/dashboard') {
            return pathname === '/blog/dashboard';
        }
        if (href === '/blog/createpost/new') {
            return pathname.startsWith('/blog/createpost');
        }
        return false;
    };

    const filteredLinks = mounted
        ? blogNavigationLinks.filter(link => {
              if (link.rol) {
                  // Check if user has the required role
                  return session?.user?.user?.role === link.rol[0];
              }
              return true; // Show links without rol to all users
          })
        : blogNavigationLinks.filter(link => !link.rol); // Only show links without rol initially

    return (
        <header className="fixed mx-auto max-w-5xl rounded-full top-8 left-0 right-0 z-20 px-4 md:px-6 bg-black/20 backdrop-blur-lg border border-white/10">
            <div className="flex h-16 items-center justify-between gap-4">
                {/* Left side */}
                <div className="flex items-center gap-2">
                    {/* Mobile menu trigger */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                className="group size-8 md:hidden"
                                variant="ghost"
                                size="icon">
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
                                    xmlns="http://www.w3.org/2000/svg">
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
                        <PopoverContent
                            align="start"
                            className="w-36 p-1 md:hidden">
                            <NavigationMenu className="max-w-none *:w-full">
                                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                                    {filteredLinks.map((link, index) => (
                                        <NavigationMenuItem
                                            key={index}
                                            className="w-full">
                                            <NavigationMenuLink
                                                asChild
                                                className="py-1.5"
                                                active={getActive(link.href)}>
                                                <Link href={link.href}>
                                                    {link.label}
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </PopoverContent>
                    </Popover>
                    {/* Main nav */}
                    <div className="flex items-center gap-6">
                        <Link
                            href="/blog"
                            className="text-primary hover:text-primary/90">
                            <Image
                                src="/devtalles2.png"
                                alt="Logo"
                                width={30}
                                height={30}
                            />
                        </Link>
                        {/* Navigation menu */}
                        <NavigationMenu className="max-md:hidden">
                            <NavigationMenuList className="gap-2">
                                {filteredLinks.map((link, index) => (
                                    <NavigationMenuItem key={index}>
                                        <NavigationMenuLink
                                            asChild
                                            active={getActive(link.href)}
                                            className="">
                                            <Link href={link.href}>
                                                {link.label}
                                            </Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>
                {/* Right side */}
                <div className="flex items-center gap-2">
                    {mounted ? (
                        session ? (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="text-white hover:text-primary">
                                        {session.user.user.firstName}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    align="end"
                                    className="w-40 p-2">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() => signOut()}>
                                        Logout
                                    </Button>
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <Button asChild variant="ghost">
                                <Link href="/blog/login">Login</Link>
                            </Button>
                        )
                    ) : (
                        <Button variant="ghost" disabled>
                            Loading...
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
