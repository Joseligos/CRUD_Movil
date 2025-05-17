export interface Multimedia {
  _id?: string;
  url: string;
  tipo?: string;
  estado?: boolean;
  IdGrupoMultimedia: string;
  fecha_creacion?: string | Date;
  fecha_actualizacion?: string | Date | null;
  __v?: number;
}

export interface MultimediaResponse {
  Ok: boolean;
  resp: Multimedia | Multimedia[];
  total?: number;
}