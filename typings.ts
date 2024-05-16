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
  image: string | null;
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
