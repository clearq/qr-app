'use client'
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

function Pages() {

  const router = useRouter()

  const handleUrl = () => {
    router.push('/')
  };
  const handleVcard = () => {
    router.push('/vcard')
  };

  return (
    <div className="grid grid-flow-row grid-cols-4 w-[40%] space-x-3">
      <Button onClick={() => handleUrl()} variant='outline' className="hover:bg-gray-800 hover:text-white">URL</Button>
      <Button onClick={() => handleVcard()} variant='outline' className="hover:bg-gray-800 hover:text-white">Vcard</Button>
    </div>
  );
}

export default Pages