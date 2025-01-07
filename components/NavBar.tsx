"use client"

import React, { useState } from 'react'
import Logo, { MobileLogo } from './Logo'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from './ui/button'
import { ThemesSwitcher } from './ThemeSwitcher'
import { UserButton } from '@clerk/nextjs'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet'
import { Menu } from 'lucide-react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

const NavBar = () => {
  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  )
}

const items = [
  {
    title: 'Dashboard',
    href: '/'
  },
  {
    title: 'Transactions',
    href: '/transactions'
  },
  {
    title: 'Manage',
    href: '/manage'
  },
]

const DesktopNav = () => {
  return (
    <div className='hidden border-separate border-b  bg-background md:block'>
      <nav className='container flex items-center mx-auto justify-between px-8'>
        <div className='flex min-h-[60px] h-[80px] items-center gap-x-4'>
          <Logo />
          <div className='flex h-full'>
            {items.map(item => (
              <NavbarItem key={item.title} href={item.href} title={item.title} />
            ))}
          </div>
        </div>
        <div className='flex items-center gap-2.5'>
          <ThemesSwitcher />
          <UserButton />
        </div>
      </nav>
    </div>
  )
}

const NavbarItem = ({ title, href, onClick }: { title: string, href: string, onClick?: () => void }) => {
  const pathName = usePathname();
  const isActive = pathName === href;

  return (
    <div className='relative flex items-center'>
      <Link href={href} title={title} className={cn(
        buttonVariants({ variant: 'ghost' }),
        "w-full justify-start text-base text-muted-foreground hover:text-foreground transition duration-300 ease-in-out",
        isActive && "text-foreground"
      )} onClick={() => {
        if (onClick) {
          onClick();
        }
      }}>{title}
      </Link>
      {isActive && (
        <div className='absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block' />
      )}
    </div>
  )
}


const MobileNav = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className='block border-separate bg-background md:hidden'>
      <nav className='container flex items-center mx-auto justify-between px-8'>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className='size-6' />
            </Button>
          </SheetTrigger>
          <SheetContent className='w-[300px] sm:w-[540px]' side={'left'}>
            <VisuallyHidden asChild>
              <SheetTitle>ASdsad</SheetTitle>
            </VisuallyHidden>
            <Logo/>
            <div className='flex flex-col gap-1 pt-4'>
              {items.map(item => (
                <NavbarItem key={item.title} href={item.href} title={item.title} onClick={() => setIsOpen((prev) => !prev)} />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className='flex h-[80px] min-h-[60px] items-center'>
          <MobileLogo/>
        </div>
        <div className='flex items-center gap-2'>
          <ThemesSwitcher/>
          <UserButton />
        </div>
      </nav>
    </div>
  )
}


export default NavBar