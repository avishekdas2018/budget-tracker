"use client"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'


const HeaderComponent = () => {

  return (
    <div className=''>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}

export default HeaderComponent