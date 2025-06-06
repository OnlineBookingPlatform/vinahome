// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  ssr: true,
  css: ["~/assets/css/main.css", "~/assets/scss/main.scss"],
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "nuxt-vue3-google-signin",
    "@nuxt/icon",
  ],
  plugins: ["~/plugins/zindex"],
  icon: {
    customCollections: [
      {
        prefix: "vuesax",
        dir: "./assets/vuesax",
      },
      {
        prefix: "vinahome",
        dir: "./public/static",
      },
    ],
  },
  googleSignIn: {
    clientId:
      "704001333674-28enifu6eje8ninqplmov13crgdfq1o2.apps.googleusercontent.com",
  },
  runtimeConfig: {
    public: {
      // apiGatewayUrl: "http://localhost:3002",
      apiGatewayUrl: process.env.API_GATEWAY_URL,
      cloudinaryBaseUrl: "https://res.cloudinary.com",
    },
  },

  imports: {
    dirs: ["./mocks"],
  },
  app: {
    head: {
      title: "VinaHome",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [
        {
          
          key: "csp",
          "http-equiv": "Content-Security-Policy", 
          content: `
            default-src 'self';
            img-src 'self' blob: data: https://upload.wikimedia.org https://img.vietqr.io https://lh3.googleusercontent.com https://res.cloudinary.com https://placehold.co;
            style-src 'self' 'unsafe-inline';
            script-src 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com https://connect.facebook.net;
            connect-src 'self' http://localhost:3002  https://api.cloudinary.com;
          `.replace(/\n/g, ''),
        },
        {
          name: "description",
          content: "VinaHome",
        },
        {
          name: "og:title",
          content: "VinaHome",
        },
        {
          name: "og:description",
          content: "VinaHome",
        },
        {
          name: "og:site_name",
          content: "VinaHome",
        },
      ],
    },
  },
});
