"use client";
import React, { useState } from "react";

const DownloadPass: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadPass = async () => {
    setLoading(true);
    setError(null);

    try {
      // Replace with the actual API route from Next.js
      const response = await fetch("/api/generate-pass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId: "some-customer-id" }), // Pass the customerId here
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ticket.pkpass"; // Default name for the file
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        setError("Failed to generate pass");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleDownloadPass} disabled={loading}>
        {loading ? "Generating Pass..." : "Download Pass"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DownloadPass;
