import React, { useState } from "react";
import { Button } from "./ui/button";

interface AddToGoogleWalletProps {
  ticketId: string;
}

const AddToGoogleWallet: React.FC<AddToGoogleWalletProps> = ({ ticketId }) => {
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddToWallet = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/addGoogle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId }),
      });

      const data = await response.json();
      if (response.ok) {
        setLink(data.url);
      } else {
        alert(data.error || "Error generating ticket");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleAddToWallet} disabled={loading}>
        {loading ? "Generating..." : "Add to Google Wallet"}
      </Button>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer">
          Add Ticket
        </a>
      )}
    </div>
  );
};

export default AddToGoogleWallet;
