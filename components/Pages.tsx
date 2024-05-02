'use client'
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

function Pages() {

  // const router = useRouter()

  // const handleUrl = () => {
  
  // };
  // const handleVcard = () => {
  // };

  return (
    <div className="grid grid-flow-row grid-cols-4 w-[40%] space-x-3">
      <Button variant='outline' className="hover:bg-gray-800 hover:text-white">URL</Button>
      <Button variant='outline' className="hover:bg-gray-800 hover:text-white">Vcard</Button>
    </div>
  );
}

export default Pages