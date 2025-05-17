import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_HEROES } from '../config/url.servicios';
import { GrupoMultimedia } from '../interfaces/grupomultimedia.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrupoMultimediaService {

  constructor(private http: HttpClient) { }

  getGrupos() {
    return this.http.get(`${URL_HEROES}/grupomultimedias`).pipe(map(data => data));
  }

  getGrupoPorId(id: string) {
    return this.http.get(`${URL_HEROES}/grupomultimedias/${id}`).pipe(map(data => data));
  }

  crearGrupo(grupo: GrupoMultimedia) {
    return this.http.post(`${URL_HEROES}/grupomultimedias`, grupo).pipe(map(data => data));
  }

  actualizarGrupo(grupo: GrupoMultimedia) {
    return this.http.put(`${URL_HEROES}/grupomultimedias/${grupo._id}`, grupo).pipe(map(data => data));
  }

  eliminarGrupo(id: string) {
    return this.http.delete(`${URL_HEROES}/grupomultimedias/${id}`).pipe(map(data => data));
  }
}
