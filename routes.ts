

export const apiRoutes = "/api/auth";

export const publicRoute = [
    "/",
    "/login",
    "/register",
    "/cookiespolicy"
]

/**
 * An array of routes that are used for auth users
 * @type {string[]}
 */
export const privateRoute: string[] = [
    "/profile",
    "/vcard",
    "/dashboard",
    "/dashboardVcard",
    "/qr",
    "/all"
]