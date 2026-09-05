import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Shop API",
    description: "API Documentation",
    version: "1.0.0",
  },
  tags: [
    {
      name: "Auth",
      description: "Authentication endpoints",
    },
    {
      name: "Brands",
      description: "Brand management endpoints",
    },
    {
      name: "Categories",
      description: "Category management endpoints",
    },
    {
      name: "Products",
      description: "Product management endpoints",
    },
    {
      name: "Media",
      description: "File upload and media management",
    },
  ],
  host: "localhost:4000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [
  "../../server.js", // or your main server file
];

swaggerAutogen(outputFile, endpointsFiles, doc);
