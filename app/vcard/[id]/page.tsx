import { IVCARD } from '@/typings';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface DataTableProps {
    vData: IVCARD[];
    refetchDataTable: () => void;
  }



const VCardDetails: React.FC<IVCARD> = ({
  firstName,
  lastName,
  customerEmail,
  phone,
  company,
  title,
  url,
  linkedIn,
  x,
  facebook,
  instagram,
  snapchat,
  tiktok,
}) => {
  return (
    <div>
      <h1>VCard Details</h1>
      <p><strong>First Name:</strong> {firstName}</p>
      <p><strong>Last Name:</strong> {lastName}</p>
      <p><strong>Email:</strong> {customerEmail}</p>
      <p><strong>Phone:</strong> {phone}</p>
      <p><strong>Company:</strong> {company}</p>
      <p><strong>Title:</strong> {title}</p>
     <p><strong>Website:</strong> <a href={url}>{url}</a></p>
     <p><strong>LinkedIn:</strong> {linkedIn}</p>
      <p><strong>X:</strong> {x}</p>
     <p><strong>Facebook:</strong> {facebook}</p>
     <p><strong>Instagram:</strong> {instagram}</p>
     <p><strong>Snapchat:</strong> {snapchat}</p>
     <p><strong>TikTok:</strong> {tiktok}</p>
    </div>
  );
};

const fetchVCardDetails = async (params: any) => {
  const { firstName, lastName, customerEmail } = params;
  
  // Fetch additional VCard details from your API if needed
  // For now, we'll just return the basic details for simplicity

  return {
    firstName,
    lastName,
    customerEmail,
    // Add other VCard properties here as needed
  };
};

export default async function Page({ params }: { params: any }) {
  const vcardDetails = await fetchVCardDetails(params);

  return <VCardDetails {...vcardDetails} />;
}