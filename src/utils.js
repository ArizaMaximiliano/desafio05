//Obtener el directorio actual
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

//Clase manejo de excepciones
export class Exception extends Error {
  constructor(message, status) {
    super(message);
    this.statusCode = status;
  }
};
