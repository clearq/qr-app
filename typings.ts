import { Category, EventTable, Product, Shop } from "@prisma/client";

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
  amountOfPeople: string;
  customerId: string;
  scanCount: string;
  fullName: string;
  guestMail: string;
  tableNumber: string;
  walletObjectId: string;
}

export interface EVENTS {
  id: string;
  eventsTitle: string;
  fromDate: string;
  toDate: string;
  description: string;
  numberOfTables: number; // Must be a number
  availabilityPerTable: number; // Must be a number
  eventTables: EventTable[]; // Properly typed as an array of EventTable objects
  customer: string;
  customerId: string;
  ticketCount: number; // Must also be a number
}

export interface SHOP {
  id: string;
  name: string;
  address: string;
  description: string;
  categories: Category[];
  products: Product[];
}

export interface CATEGORY {
  id: string;
  name: string;
  shop: Shop;
  shopId: String;
  products: Product[];
}

export interface PRODUCT {
  id: string;
  title: string;
  category: Category;
  categoryId: string;
  description: string;
}
