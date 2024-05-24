import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

function Pages() {
  const router = useRouter();

  const handleUrl = () => {
    router.push("/");
  };

  const handleVcard = () => {
    router.push("/vcard");
  };

  return (
    <div className="flex">
      <div className="grid grid-cols-2 sm:grid-cols-2 w-[150px] gap-3 max-w-md sm:w-[300px]">
        <Button
          onClick={handleUrl}
          variant="outline"
          className="hover:bg-gray-800 hover:text-white"
        >
          URL
        </Button>
        <Button
          onClick={handleVcard}
          variant="outline"
          className="hover:bg-gray-800 hover:text-white"
        >
          Vcard
        </Button>
      </div>
    </div>
  );
}

export default Pages;
