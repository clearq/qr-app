import { ReactNode } from "react";

export interface ICommon {
  linkUrl: string;
  linkText: string;
  darkMode: boolean;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogTitle?: string;
    ogDescription?: string;
    siteName?: string;
    metaImage?: {
      data: {
        attributes: {
          width: number;
          height: number;
          url: string;
          alternativeText: string;
        };
      };
    };
    metaSocial?: {
      id: string;
      socialNetwork?: "Facebook" | "Twitter";
      title?: string;
      description?: string;
      image?: {
        data?: {
          attributes?: {
            url?: string;
            width: string;
            height: string;
            mime?: string;
            alternativeText?: string;
          };
        };
      };
    }[];
  };
}

export interface Github {
  stars: number;
}

export type InputProps = {
  typeOfInput: "text" | "url" | "email" | "tel" | "vCard" | "wifi" | "sms";
};
export interface ICUSTOMER {
  id: String;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  company: string;
  image: string;
}

export interface IVCARD {
  id: string;
  firstName: string;
  lastName: string;
  tag: string;
  customerEmail: string;
  phone: string;
  company: string;
  title: string;
  logoType: string | null;
  image: string;
  linkedIn: string;
  x: string;
  facebook: string;
  instagram: string;
  snapchat: string;
  tiktok: string;
  url: string;
  customerId: string;
}

export interface IQR {
  id: string;
  url: string;
  tag: string;
  logoType: string | null;
  customerId: string;
}

export interface TICKET {
  id: string;
  ticketsName: string;
  eventsTitle: string;
  fromDate: Date;
  toDate: Date;
  qrNumber: string;
  description: string;
  scanCount: string;
  scans: string;
  customerId: string;
}
export interface EVENTS {
  ticketCount: ReactNode;
  id: string;
  eventsTitle: string;
  fromDate: string;
  toDate: string;
  description: string;
  customer: string;
  customerId: string;
}
