//@Manu
export interface User {
    
    
    uid: string; 
    nombre:string;
    radioAlcance: number; // Ejemplo: 10 metros
    ubicacion?: { lat: number; lng: number };
    imageUrls?: string[];
}


export interface SubirImg extends User {
    imageUrls?: string[];  // Si necesitas almacenar varias URLs de imágenes
  }

//proxima tarea terminar la base de datos y ver como interactua con el mapa   