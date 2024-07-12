import { auth } from "@/auth";
import { VcardSingelComponent } from "@/components/vcard-singel-component";
import React from "react";

const VCardDetails = async () => {
  const session = await auth();
  return (
    <div>
      <VcardSingelComponent user={session?.user} />
    </div>
  );
};

export default VCardDetails;
