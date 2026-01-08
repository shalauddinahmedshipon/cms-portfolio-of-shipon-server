import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Backend API Shipon portfolio')
  .setDescription('Comprehensive API documentation for the application services')
  .setVersion('1.0')
  .addTag('API')
//   .addApiKey(
//   {
//     type: 'apiKey',
//     name: 'authorization',
//     in: 'header',
//   },
//   'auth',
// )
.addBearerAuth(
  {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    name: 'Authorization',
    in: 'header',
  },
  'auth',
)
.addSecurityRequirements({
  auth: [],
})
  .build();
