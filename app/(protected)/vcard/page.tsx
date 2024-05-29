"use client";
import Pages from "@/components/Pages";
import { Vcard } from "@/components/Vcard";


export default function Home() {


  return (
    <div className="flex justify-center items-center">
      <div className="max-w-xl w-full">
        <Pages />
        <Vcard/>
      </div>
    </div>
  );
}
