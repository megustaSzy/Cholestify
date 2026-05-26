import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Cholestify",
      version: "1.0.0",
      description:
        "Documentation API untuk project Cholestify. Autentikasi menggunakan HTTP-only Cookie yang di-set otomatis saat login.",
    },
    servers: [
      {
        url: process.env.API_URL,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description:
            "Token autentikasi dikirim otomatis via HTTP-only Cookie setelah login.",
        },
      },
      schemas: {
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Data berhasil diambil" },
            metadata: {
              type: "object",
              properties: { status: { type: "integer", example: 200 } },
            },
            data: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Pesan error" },
            metadata: {
              type: "object",
              properties: { status: { type: "integer", example: 400 } },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
