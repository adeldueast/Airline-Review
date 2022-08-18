/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["image.tmdb.org", "lh3.googleusercontent.com","open-flights.s3.amazonaws.com"],
  },
  // TODO: set restrict mode back to true. only fix until PL merge https://github.com/firebase/firebaseui-web-react/pull/173
  reactStrictMode: false,
  swcMinify: true,
};

module.exports = nextConfig;
