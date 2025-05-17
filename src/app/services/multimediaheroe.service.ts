import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_HEROES } from '../config/url.servicios';
import { MultimediaHeroe } from '../interfaces/multimediaheroe.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultimediaHeroeService {

  constructor(private http: HttpClient) { }

  getMultimediaHeroe() {
    return this.http.get(`${URL_HEROES}/multimediaheroes`).pipe(map(data => data));
  }

  getMultimediaHeroePorId(id: string) {
    return this.http.get(`${URL_HEROES}/multimediaheroes/${id}`).pipe(map(data => data));
  }

  crearMultimediaHeroe(mh: MultimediaHeroe) {
    return this.http.post(`${URL_HEROES}/multimediaheroes`, mh).pipe(map(data => data));
  }

  actualizarMultimediaHeroe(mh: MultimediaHeroe) {
    return this.http.put(`${URL_HEROES}/multimediaheroes/${mh._id}`, mh).pipe(map(data => data));
  }

  eliminarMultimediaHeroe(id: string) {
    return this.http.delete(`${URL_HEROES}/multimediaheroes/${id}`).pipe(map(data => data));
  }
}
