import { ReactNode } from 'react'

const WizardLayout = ({children}: {children: ReactNode}) => {
  return (
    <div className='relative flex flex-col h-screen w-full items-center justify-center'>
      {children}
    </div>
  )
}

export default WizardLayout