import { ValidationPipe } from '@nestjs/common';

export const AppValidationPipe = new ValidationPipe({
  whitelist: true, // Supprime les props non listées dans le DTO
  forbidNonWhitelisted: true, // Jette une erreur si props non attendues
  transform: true, // Transforme les types (string → number etc.)
});
