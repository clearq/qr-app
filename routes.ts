export const apiRoutes = "/api/auth";

export const publicRoute = [
  "/",
  "/login",
  "/register",
  "/cookiespolicy",
  "/qr/details",
  "/vcard/details",
  "/redirect",
  "/profile",
];

/**
 * An array of routes that are used for auth users
 * @type {string[]}
*/
export const privateRoute: string[] = [
  "/vcard",
  "/ticket",
  "/dashboard",
  "/coDashboard/dashboardStamp",
  "/dashboardVcard",
  "/qr",
  "/all",
  "/card"
];
