import { CurrencyBox } from '@/components/CurrencyBox'
import Logo from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { auth, currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const WizardPage = async () => {
  const { userId } = await auth()
  const isAuth = !!userId
  const user = await currentUser()

  if (!isAuth) {
    redirect('/sign-in')
  }

  return (
    <div className='container max-w-2xl flex flex-col items-center justify-between gap-4'>
      <div>
        <h1 className='text-center text-3xl'>
          Welcome, <span className='ml-2 font-bold'>{user?.firstName}!👋</span>
        </h1>
        <h2 className='mt-4 text-base text-center text-muted-foreground'>
          Let &apos;s get started by setting up your currency
        </h2>
        <h3 className='mt-2 text-center text-sm text-muted-foreground'>
          You can change this later any time
        </h3>
      </div>
      <Separator className='w-10/12 lg:w-full' />
      <Card className='lg:w-full'>
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>Set up your default currency for transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyBox/>
        </CardContent>
      </Card>
      <Separator className='w-10/12 lg:w-full'/>
      <Button className='lg:w-full w-10/12' asChild>
        <Link href={"/"} className='font-semibold' >
          I&apos;m done! Take me to the dashboard
        </Link>
      </Button>
      <div className='mt-8'>
        <Logo/>
      </div>
    </div>
  )
}

export default WizardPage