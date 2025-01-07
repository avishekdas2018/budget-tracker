import NavBar from '@/components/NavBar'
import React, { ReactNode } from 'react'

const DashboardLayout = ({children}: {children: ReactNode}) => {
  return (
    <div className='w-full min-h-screen flex flex-col '>
      <NavBar/>
      <div className='w-full'>
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout