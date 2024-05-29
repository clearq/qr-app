import { QrForm } from "@/components/qr-form"
import {auth} from '@/auth'

const QrPage = async  () => {

  const session = await auth();

  return (
    <div>
      <QrForm  />
    </div>
  )
}

export default QrPage
