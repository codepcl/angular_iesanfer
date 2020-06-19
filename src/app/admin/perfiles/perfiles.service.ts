import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, map, tap } from 'rxjs/operators';

export interface Perfil{
  id?: number;
  perfil?: string;
  estado?: number;
  created_at?: Date;
  updated_at?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PerfilesService {

  _URL:any = "";
  _httpOptions:any; 

  constructor(private http: HttpClient) {
      this._URL = "http://localhost:3000/api/perfiles";
      this._httpOptions = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('ApiToken')
        });
      
   }

  getPerfiles(){
    return this.http.get<Perfil[]>(this._URL, {headers: this._httpOptions}).pipe(
      retry(2)
    );

  }

  getPerfil(id: number){
    const UrlGetPerfil = this._URL + "/" + id;
    return this.http.get<Perfil>(UrlGetPerfil, {headers: this._httpOptions});
  }

  createPerfiles(perfil: Perfil){
    console.warn("El perfil que se va a almacenar: "+ perfil);
    
    return this.http.post<Perfil>(this._URL, perfil, {headers: this._httpOptions});
  }

  deletePerfiles(id : number){
    const UrlDelete = this._URL + "/"+id;
    return this.http.delete(UrlDelete, {headers: this._httpOptions});
  }

  updatePerfiles(id: number, perfil: Perfil){
    const UrlEstado = this._URL + "/"+id;
    return this.http.put(UrlEstado, perfil, {headers: this._httpOptions});
  }

  updateEstado(id: number, perfil: Perfil){
    console.error("El perfil "+ id + " - "+perfil);
    const UrlEstado = this._URL + "/estado/"+id;
    return this.http.put(UrlEstado, perfil, {headers: this._httpOptions});
  }
}
