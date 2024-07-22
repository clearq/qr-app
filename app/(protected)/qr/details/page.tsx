import { auth } from "@/auth";
import { QrSingelComponent } from "@/components/qr-silngel-component";



const QrDetails = async () => {
  const session = await auth()
  
  return (
    <div>
      
    <QrSingelComponent user={session?.user} />
    </div>
  );
};


export default QrDetails;