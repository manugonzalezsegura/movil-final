import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthserviceService} from '../services/authservice.service'; 
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  //@Manu
  constructor(private authService: AuthserviceService, private router: Router) {}

  
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Ahora accedemos al estado de autenticación a través del método público
    return this.authService.authState.pipe(
      take(1),
      map(user => {
        if (user) {
          return true; // El usuario está autenticado
        } else {
          this.router.navigate(['/login']); // Redirige al login si no está autenticado
          return false;
        }
      })
    );
  }

}
