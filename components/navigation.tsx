"use client";

import { usePathname, useRouter } from "next/navigation";
import NavButton from "./nav-button";
import { useMedia } from "react-use";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

const routes = [
    {
        href: '/',
        label: 'Overview'
    },
    {
        href: '/transactions',
        label: 'Transactions'
    },
    {
        href: '/accounts',
        label: 'Accounts'
    },
    {
        href: '/categories',
        label: 'Categories'
    },
]

const Navigation = () => {
    const pathname = usePathname();
    const router = useRouter();
    const isMobile = useMedia("(max-width:1024px)", false);


    const [isOpen, setIsOpen] = useState(false);

    const onClick = (href: string) => {
        router.push(href);
        setIsOpen(false);
    }

    if (isMobile) {
        return <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger>
                <Button variant={'outline'} size={'sm'} className="font-normal  text-white bg-white/10 hover:bg-white/20 focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none focus:bg-white/30 transition border-none ">
                    <Menu className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent side={"left"} className="px-2 ">

                <nav className="flex flex-col gap-y-2 pt-6">
                    {routes.map((route) => {
                        return <Button key={route.href}
                            variant={route.href === pathname ? "secondary" : "ghost"}
                            onClick={() => onClick(route.href)}
                            className="w-full justify-start"
                        >
                            {
                                route.label
                            }
                        </Button>
                    })}
                </nav>
            </SheetContent>
        </Sheet>
    }
    return (
        <nav className="hidden lg:flex items-center gap-x-2 overflow-auto">
            {routes.map((route) => {
                return <NavButton key={route.href} href={route.href} label={route.label} isActive={pathname === route.href} />
            })}
        </nav>
    )
}

export default Navigation