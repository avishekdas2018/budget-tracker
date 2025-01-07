import Logo from '@/components/Logo'
import React, { ReactNode } from 'react'

const AuthLayout = ({children}: {children: ReactNode}) => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <Logo/>
      <div className='mt-10'>
        {children}
      </div>

    </div>
  )
}

export default AuthLayout