import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { GrupoMultimedia, GrupoMultimediaResponse } from '../interfaces/grupo-multimedia.interface';
import { URL_BACKEND } from '../config/url.servicios';

@Injectable({
  providedIn: 'root'
})
export class GrupoMultimediaService {
  private apiUrl = `${URL_BACKEND}/grupomultimedias`;
  constructor(private http: HttpClient) { 
    console.log('API URL:', this.apiUrl);
  }
  
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => error);
  }
  /**
   * Obtiene todos los grupos multimedia con paginación
   */  getGrupoMultimedias(limite: number = 5, desde: number = 0): Observable<GrupoMultimediaResponse> {
    const url = `${this.apiUrl}?limite=${limite}&desde=${desde}`;
    console.log('Llamando a URL:', url);
    return this.http.get<GrupoMultimediaResponse>(url)
      .pipe(
        tap(response => console.log('API Response:', response)),
        catchError(this.handleError)
      );
  }
  /**
   * Obtiene un grupo multimedia por su ID
   */  getGrupoMultimedia(id: string): Observable<GrupoMultimediaResponse> {
    return this.http.get<GrupoMultimediaResponse>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(response => console.log('Get grupo multimedia response:', response)),
        catchError(this.handleError)
      );
  }
  
  /**
   * Crea un nuevo grupo multimedia
   */
  createGrupoMultimedia(grupo: GrupoMultimedia): Observable<GrupoMultimediaResponse> {
    console.log('Creating grupo multimedia:', grupo);
    return this.http.post<GrupoMultimediaResponse>(this.apiUrl, grupo)
      .pipe(
        tap(response => console.log('Create grupo multimedia response:', response)),
        catchError(this.handleError)
      );
  }  /**
   * Actualiza un grupo multimedia existente
   */
  updateGrupoMultimedia(id: string, grupo: GrupoMultimedia): Observable<GrupoMultimediaResponse> {
    console.log(`Updating grupo multimedia with ID ${id}:`, grupo);
    
    // Asegurarse de que el objeto tiene el formato correcto
    const payload = {
      nombre: grupo.nombre
    };
    
    return this.http.put<GrupoMultimediaResponse>(`${this.apiUrl}/${id}`, payload)
      .pipe(
        tap(response => console.log('Update grupo multimedia response:', response)),
        catchError(error => {
          console.error('Error updating grupo multimedia:', error);
          return this.handleError(error);
        })
      );
  }
  /**
   * Elimina un grupo multimedia (cambio de estado a false)
   */
  deleteGrupoMultimedia(id: string): Observable<GrupoMultimediaResponse> {
    console.log(`Deleting grupo multimedia with ID ${id}`);
    return this.http.delete<GrupoMultimediaResponse>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(response => console.log('Delete grupo multimedia response:', response)),
        catchError(error => {
          console.error('Error deleting grupo multimedia:', error);
          return this.handleError(error);
        })
      );
  }
}