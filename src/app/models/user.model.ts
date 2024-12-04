//@Manu
export interface User {
  uid: string; 
  nombre: string;
  radioAlcance?: number; // Ejemplo: 10 metros
  ubicacion?: { lat: number; ln?: number };
  imageUrls?: string[];
  password?: string; // Contraseña opcional
}

export interface SubirImg extends User {
  imageUrls?: string[];  // Si necesitas almacenar varias URLs de imágenes
}

// Próxima tarea: terminar la base de datos y ver cómo interactúa con el mapa
