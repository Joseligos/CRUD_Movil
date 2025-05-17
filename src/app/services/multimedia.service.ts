import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_BACKEND } from '../config/url.servicios';
import { Multimedia, MultimediaResponse } from '../interfaces/multimedia.interface';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultimediaService {
  private apiUrl = `${URL_BACKEND}/multimedias/multimedias`;
  
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
    // Fix the URL path by removing any potential double slashes
    const url = `${this.apiUrl}?limite=${limite}&desde=${desde}`;
    console.log('Calling URL for getMultimedias:', url);
    
    return this.http.get<MultimediaResponse>(url)
      .pipe(
        tap(response => console.log('API Response from getMultimedias:', response)),
        catchError(error => {
          console.error('Error in getMultimedias:', error);
          return this.handleError(error);
        })
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
    // Use a URL that matches the backend route
    const url = `${this.apiUrl}/grupomultimedia/${grupoId}`;
    console.log('Calling URL for getMultimediasByGrupo:', url);
    return this.http.get<MultimediaResponse>(url)
      .pipe(
        tap(response => console.log('Get multimedia by grupo response:', response)),
        catchError(error => {
          console.error('Error in getMultimediasByGrupo:', error);
          return this.handleError(error);
        })
      );
  }
    /**
   * Crea una nueva multimedia
   */
  createMultimedia(multimedia: Multimedia): Observable<MultimediaResponse> {
    console.log('Creating multimedia:', multimedia);
    const url = this.apiUrl;
    console.log('POST request to URL:', url);
    
    return this.http.post<MultimediaResponse>(url, multimedia)
      .pipe(
        tap(response => console.log('Create multimedia response:', response)),
        catchError(error => {
          console.error('Error creating multimedia:', error);
          return this.handleError(error);
        })
      );
  }
  
  /**
   * Actualiza una multimedia existente
   */
  updateMultimedia(id: string, multimedia: Multimedia): Observable<MultimediaResponse> {
    console.log(`Updating multimedia with ID ${id}:`, multimedia);
    
    const url = `${this.apiUrl}/${id}`;
    console.log('PUT request to URL:', url);
    
    return this.http.put<MultimediaResponse>(url, multimedia)
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
    const url = `${this.apiUrl}/${id}`;
    console.log('DELETE request to URL:', url);
    
    return this.http.delete<MultimediaResponse>(url)
      .pipe(
        tap(response => console.log('Delete multimedia response:', response)),
        catchError(error => {
          console.error('Error deleting multimedia:', error);
          return this.handleError(error);
        })
      );
  }
}