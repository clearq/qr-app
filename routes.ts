export const apiRoutes = "/api/auth";

export const publicRoute = [
  "/",
  "/login",
  "/register",
  "/cookiespolicy",
  "/qr/details",
  "/vcard/details",
  ];
  
  /**
   * An array of routes that are used for auth users
   * @type {string[]}
  */
 export const privateRoute: string[] = [
   "/profile",
   "/dashboardVcard",
   "/dashboard",
  "/vcard",
  "/qr",
  "/all",
  "/redirect",
];
