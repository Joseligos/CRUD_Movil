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
   */
  getGrupoMultimedia(id: string): Observable<GrupoMultimediaResponse> {
    return this.http.get<GrupoMultimediaResponse>(`${this.apiUrl}/${id}`);
  }  /**
   * Crea un nuevo grupo multimedia
   */
  createGrupoMultimedia(grupo: GrupoMultimedia): Observable<GrupoMultimediaResponse> {
    console.log('Creating grupo multimedia:', grupo);
    return this.http.post<GrupoMultimediaResponse>(this.apiUrl, grupo);
  }

  /**
   * Actualiza un grupo multimedia existente
   */
  updateGrupoMultimedia(id: string, grupo: GrupoMultimedia): Observable<GrupoMultimediaResponse> {
    return this.http.put<GrupoMultimediaResponse>(`${this.apiUrl}/${id}`, grupo);
  }

  /**
   * Elimina un grupo multimedia (cambio de estado a false)
   */
  deleteGrupoMultimedia(id: string): Observable<GrupoMultimediaResponse> {
    return this.http.delete<GrupoMultimediaResponse>(`${this.apiUrl}/${id}`);
  }
}