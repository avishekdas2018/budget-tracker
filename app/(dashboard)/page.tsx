import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import CreateTransactionDialog from './_components/CreateTransactionDialog'
import Overview from './_components/Overview'
import HistorySection from './_components/HistorySection'
import { CardFooter } from '@/components/ui/card'

const DashboardPage = async () => {
  const { userId } = await auth()
  const isAuth = !!userId
  const user = await currentUser()

  if (!isAuth) {
    redirect('/sign-in')
  }

  const userSetting = await prisma.userSettings.findUnique({
    where: {
      userId: user?.id,
    }
  })

  if (!userSetting) {
    redirect("/wizard")
  }



  return (
    <div className='h-full bg-background'>
      <div className='border-b bg-card'>
        <div className='flex flex-wrap items-center justify-between gap-6 py-8 px-10'>
          <p className='text-3xl font-bold'>
            Hello, {user?.firstName}! 👋
          </p>
          <div className='flex items-center gap-3'>
            <CreateTransactionDialog trigger={
              <Button variant={'outline'} className='border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white transition duration-300 ease-in-out'>
                New income 🤑
              </Button>
            } type='income'
            />

            <CreateTransactionDialog trigger={
              <Button variant={'outline'} className='border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white transition duration-300 ease-in-out'>
                New expense 😤
              </Button>

            } type='expense' />
          </div>
        </div>
      </div>
      <Overview userSettings={userSetting} />
      <HistorySection userSettings={userSetting} />
      <div className='flex items-center justify-center gap-4 mt-16'>
        <CardFooter>
          <p className='text-sm text-muted-foreground'>Developed with 💖 by Avishek Das</p>
        </CardFooter>
      </div>
    </div>
  )
}

export default DashboardPage