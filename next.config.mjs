
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // 1. La URL interna que tu frontend usará.
        source: "/api-imagenes/:path*",

        // 2. La URL de destino real (el otro proyecto).
        // Le decimos: Ve al puerto 3001 y usa el resto de la ruta.
        // El path* ahora incluirá: "uploads/bedrooms/..."
        destination: "http://localhost:3001/:path*",
      },
    ];
  },
};

// module.exports = {
//   target: "serverless",

//   publicRuntimeConfig: {
//     BASEURL: "localhost:3000",
//   },
// };
export default nextConfig;
