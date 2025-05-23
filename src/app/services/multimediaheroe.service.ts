import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_BACKEND, getBackendUrl } from '../config/url.servicios';
import { MultimediaHeroe } from '../interfaces/multimediaheroe.interface';
import { Observable, catchError, map, tap, throwError, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultimediaHeroeService {  
  private apiUrl = `${getBackendUrl()}/multimediasheroe`;
  
  constructor(private http: HttpClient) {
    console.log('MultimediaHeroe API URL:', this.apiUrl);
  }
    private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código: ${error.status}, Mensaje: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => error);
  }
  
  getMultimediaHeroe(): Observable<any> {
    // Corrección: esta URL debe obtener todas las asociaciones de multimedia-héroe
    const url = `${this.apiUrl}`;
    console.log('Calling URL for getMultimediaHeroe:', url);
    return this.http.get(url).pipe(
      retry(3), // Reintentar hasta 3 veces en caso de error
      tap(response => console.log('API Response from getMultimediaHeroe:', response)),
      catchError(this.handleError)
    );
  }
  getMultimediaHeroePorId(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Calling URL for getMultimediaHeroePorId:', url);
    return this.http.get(url).pipe(
      tap(response => console.log('API Response from getMultimediaHeroePorId:', response)),
      catchError(this.handleError)
    );
  }
    getMultimediasPorHeroe(heroeId: string): Observable<any> {
    const url = `${this.apiUrl}/heroe/${heroeId}`;
    console.log('Calling URL for getMultimediasPorHeroe:', url);
    
    return this.http.get(url).pipe(
      tap(response => {
        console.log('API Response from getMultimediasPorHeroe:', response);
        
        // Additional debug for response structure
        if (response && (response as any).resp) {
          const items = (response as any).resp;
          console.log(`Received ${Array.isArray(items) ? items.length : 0} multimedia items for hero ${heroeId}`);
          
          if (Array.isArray(items) && items.length > 0) {
            console.log('First item example:', items[0]);
          }
        }
      }),
      catchError(error => {
        console.error(`Error fetching multimedia for hero ${heroeId}:`, error);
        return this.handleError(error);
      })
    );
  }

  crearMultimediaHeroe(mh: MultimediaHeroe): Observable<any> {
    console.log('Calling URL for crearMultimediaHeroe:', this.apiUrl);
    console.log('Payload:', mh);
    return this.http.post(this.apiUrl, mh).pipe(
      tap(response => console.log('API Response from crearMultimediaHeroe:', response)),
      catchError(this.handleError)
    );
  }

  actualizarMultimediaHeroe(mh: MultimediaHeroe): Observable<any> {
    const url = `${this.apiUrl}/${mh._id}`;
    console.log('Calling URL for actualizarMultimediaHeroe:', url);
    console.log('Payload:', mh);
    return this.http.put(url, mh).pipe(
      tap(response => console.log('API Response from actualizarMultimediaHeroe:', response)),
      catchError(this.handleError)
    );
  }

  eliminarMultimediaHeroe(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Calling URL for eliminarMultimediaHeroe:', url);
    return this.http.delete(url).pipe(
      tap(response => console.log('API Response from eliminarMultimediaHeroe:', response)),
      catchError(this.handleError)
    );
  }
}
