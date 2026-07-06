import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api', // Where your API routes are
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'SawaFlix API - Creator & Admin Portal',
        version: '1.0.0',
        description: 'Endpoints for Creator Verification and Admin Management',
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [],
    },
  });
  return spec;
};