// ./initAuth.js
import { init } from "next-firebase-auth"
import absoluteUrl from "next-absolute-url"
const initAuth = () => {
  init({
    // This demonstrates setting a dynamic destination URL when
    // redirecting from app pages. Alternatively, you can simply
    // specify `authPageURL: '/auth-ssr'`.
    authPageURL: ({ ctx }) => {
      // return '/auth'
      const isServerSide = typeof window === "undefined"
      const origin = isServerSide
        ? absoluteUrl(ctx.req).origin
        : window.location.origin
      const destPath =
        typeof window === "undefined" ? ctx.resolvedUrl : window.location.href
      const destURL = new URL(destPath, origin)
      return `/auth?destination=${encodeURIComponent(destURL)}`
    },

    // This demonstrates setting a dynamic destination URL when
    // redirecting from auth pages. Alternatively, you can simply
    // specify `appPageURL: '/'`.
    appPageURL: ({ ctx }) => {
      const isServerSide = typeof window === "undefined"
      const origin = isServerSide
        ? absoluteUrl(ctx.req).origin
        : window.location.origin
      const params = isServerSide
        ? new URL(ctx.req.url, origin).searchParams
        : new URLSearchParams(window.location.search)
      const destinationParamVal = params.get("destination")
        ? decodeURIComponent(params.get("destination"))
        : undefined

      // By default, go to the index page if the destination URL
      // is invalid or unspecified.
      let destURL = "/"
      if (destinationParamVal) {
        // Verify the redirect URL host is allowed.
        // https://owasp.org/www-project-web-security-testing-guide/v41/4-Web_Application_Security_Testing/11-Client_Side_Testing/04-Testing_for_Client_Side_URL_Redirect
        const allowedHosts = [
          "localhost:3000",
          "nfa-example.vercel.app",
          "nfa-example-git-v1x-gladly-team.vercel.app",
        ]
        const allowed =
          allowedHosts.indexOf(new URL(destinationParamVal).host) > -1
        if (allowed) {
          destURL = destinationParamVal
        } else {
          // eslint-disable-next-line no-console
          console.warn(
            `Redirect destination host must be one of ${allowedHosts.join(
              ", "
            )}.`
          )
        }
      }
      return destURL
    },

    loginAPIEndpoint: "/api/login", // required
    logoutAPIEndpoint: "/api/logout", // required
    onLoginRequestError: (err) => {
      console.error(err)
    },
    onLogoutRequestError: (err) => {
      console.error(err)
    },
    // firebaseAuthEmulatorHost: 'localhost:9099',
    firebaseAdminInitConfig: {
      credential: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key must not be accessible on the client side.
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n")
          : undefined,
      },
      // databaseURL: 'https://airline-reviews-8d0a0.firebaseio.com',
    },
    // Use application default credentials (takes precedence over firebaseAdminInitConfig if set)
    // useFirebaseAdminDefaultCredential: true,
    firebaseClientInitConfig: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    },
    cookies: {
      name: "Airline-Reviews", // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: "/",
      sameSite: "strict",
      secure: false, // set this to false in local (non-HTTPS) development
      signed: true,
    },
    onVerifyTokenError: (err) => {
      console.error(err)
    },
    onTokenRefreshError: (err) => {
      console.error(err)
    },
  })
}

export default initAuth
