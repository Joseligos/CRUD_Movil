import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_HEROES } from '../config/url.servicios';
import { Multimedia } from '../interfaces/multimedia.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultimediaService {

  constructor(private http: HttpClient) { }

  getMultimedias() {
    return this.http.get(`${URL_HEROES}/multimedias`).pipe(map(data => data));
  }

  getMultimediaPorId(id: string) {
    return this.http.get(`${URL_HEROES}/multimedias/${id}`).pipe(map(data => data));
  }

  crearMultimedia(multimedia: Multimedia) {
    return this.http.post(`${URL_HEROES}/multimedias`, multimedia).pipe(map(data => data));
  }

  actualizarMultimedia(multimedia: Multimedia) {
    return this.http.put(`${URL_HEROES}/multimedias/${multimedia._id}`, multimedia).pipe(map(data => data));
  }

  eliminarMultimedia(id: string) {
    return this.http.delete(`${URL_HEROES}/multimedias/${id}`).pipe(map(data => data));
  }
}
