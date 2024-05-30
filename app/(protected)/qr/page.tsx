import { QrForm } from "@/components/qr-form"
import {auth} from '@/auth'
import Pages from "@/components/Pages";

const QrPage = async  () => {

  const session = await auth();

  return (
    
    <div>
      <QrForm  />
    </div>
  )
}

export default QrPage
