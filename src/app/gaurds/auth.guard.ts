import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { AuthService } from "../authh.service";
import { catchError, map, Observable, switchMap } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
  })
  export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
  const requiredRole = route.data['role'];
  return this.authService.user$.pipe(
  switchMap(user => {
  if (!user) {
  this.router.navigate(['/login']);
  return of(false);
  }
  return this.authService.getUserRole(user.uid).pipe(
  map(role => {
  if (role === requiredRole) return true;
  this.router.navigate(['/unauthorized']);
  return false;
  
  })
  );
  }),
  catchError(() => {
  this.router.navigate(['/login']);
  return of(false);
  })
  );
  }
  }