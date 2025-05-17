import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_BACKEND } from '../config/url.servicios';
import { Multimedia, MultimediaResponse } from '../interfaces/multimedia.interface';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultimediaService {
  private apiUrl = `${URL_BACKEND}/multimedias`;
  
  constructor(private http: HttpClient) {
    console.log('API URL:', this.apiUrl);
  }
  
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => error);
  }
  
  /**
   * Obtiene todas las multimedias con paginación
   */
  getMultimedias(limite: number = 10, desde: number = 0): Observable<MultimediaResponse> {
    const url = `${this.apiUrl}?limite=${limite}&desde=${desde}`;
    console.log('Llamando a URL:', url);
    return this.http.get<MultimediaResponse>(url)
      .pipe(
        tap(response => console.log('API Response:', response)),
        catchError(this.handleError)
      );
  }
  
  /**
   * Obtiene una multimedia por su ID
   */
  getMultimedia(id: string): Observable<MultimediaResponse> {
    return this.http.get<MultimediaResponse>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(response => console.log('Get multimedia response:', response)),
        catchError(this.handleError)
      );
  }
  
  /**
   * Obtiene multimedias por grupo multimedia
   */
  getMultimediasByGrupo(grupoId: string): Observable<MultimediaResponse> {
    return this.http.get<MultimediaResponse>(`${this.apiUrl}/grupomultimedia/${grupoId}`)
      .pipe(
        tap(response => console.log('Get multimedia by grupo response:', response)),
        catchError(this.handleError)
      );
  }
  
  /**
   * Crea una nueva multimedia
   */
  createMultimedia(multimedia: Multimedia): Observable<MultimediaResponse> {
    console.log('Creating multimedia:', multimedia);
    return this.http.post<MultimediaResponse>(this.apiUrl, multimedia)
      .pipe(
        tap(response => console.log('Create multimedia response:', response)),
        catchError(this.handleError)
      );
  }
  
  /**
   * Actualiza una multimedia existente
   */
  updateMultimedia(id: string, multimedia: Multimedia): Observable<MultimediaResponse> {
    console.log(`Updating multimedia with ID ${id}:`, multimedia);
    
    return this.http.put<MultimediaResponse>(`${this.apiUrl}/${id}`, multimedia)
      .pipe(
        tap(response => console.log('Update multimedia response:', response)),
        catchError(error => {
          console.error('Error updating multimedia:', error);
          return this.handleError(error);
        })
      );
  }

  /**
   * Elimina una multimedia (cambio de estado a false)
   */
  deleteMultimedia(id: string): Observable<MultimediaResponse> {
    console.log(`Deleting multimedia with ID: ${id}`);
    return this.http.delete<MultimediaResponse>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(response => console.log('Delete multimedia response:', response)),
        catchError(error => {
          console.error('Error deleting multimedia:', error);
          return this.handleError(error);
        })
      );
  }
}