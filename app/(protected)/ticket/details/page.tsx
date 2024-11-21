import { auth } from "@/auth";
import { TicketSingelComponent } from "@/components/ticket-singel-component";
import React from "react";

const TicketDetails = async () => {
  const session = await auth();
  return (
    <div>
      <TicketSingelComponent />
    </div>
  );
};

export default TicketDetails;
