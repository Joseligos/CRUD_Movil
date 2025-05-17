export interface GrupoMultimedia {
  _id?: string;
  nombre: string;
  estado?: boolean;
  fecha_creacion?: string | Date;
  fecha_actualizacion?: string | Date | null;
}

export interface GrupoMultimediaResponse {
  Ok: boolean;
  resp: GrupoMultimedia | GrupoMultimedia[];
  total?: number;
}
