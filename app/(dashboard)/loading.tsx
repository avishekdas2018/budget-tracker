import { Loader2 } from "lucide-react"


const loading = () => {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <Loader2 className='animate-spin size-16 text-green-500' />
    </div>
  )
}

export default loading