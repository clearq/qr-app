import { auth } from "@/auth";
import TicketSingelComponent from "@/components/ticket-singel-component2";
import React from "react";

const TicketDetails = async () => {
  const session = await auth();
  return (
    <div>
      <TicketSingelComponent params={{
        eventId: ""
      }} />
    </div>
  );
};

export default TicketDetails;
