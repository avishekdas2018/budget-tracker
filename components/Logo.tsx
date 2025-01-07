"use client"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = () => {
  return (
    <Link href={'/'} className='flex items-center gap-2'>
      <Image src={'/mint-2.png'} alt='logo' width={50} height={50} />
      <p className='bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent'>
        MintyBudget
      </p>
    </Link>
  )
}


export const MobileLogo = () => {
  return (
    <Link href={'/'} className='flex items-center gap-2'>
      <p className='bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent'>
        MintyBudget
      </p>
    </Link>
  )
}

export default Logo