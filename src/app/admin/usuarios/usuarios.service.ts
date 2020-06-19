import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry } from 'rxjs/operators';

export interface Usuario{
  id? : string;
  documento? : string;
  usuario? : string;
  password? : string;
  // password_confirmation? : string;
  nombres? : string;
  apepat? : string;
  apemat? : string;
  email? : string;
  telefono? : string;
  direccion? : string;
  estado? : number;
  perfil? : number;
  created_at? : Date;
  updated_at? : Date;
}



@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  _URL: any;
  _httpOptions:any;

  constructor(private http: HttpClient) {
    this._URL = "http://localhost:3000/api/usuarios";
    this._httpOptions = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('ApiToken')
      });
   }

   getUsuarios(){
    return this.http.get<Usuario[]>(this._URL, {headers: this._httpOptions}).pipe(
      retry(2)
    );

  }

  
  getUsuario(id: number){
    const UrlGetUsuario = this._URL + "/" + id;
    return this.http.get<Usuario>(UrlGetUsuario, {headers: this._httpOptions});
  }

  createUsuarios(usuario: Usuario){
    console.warn("El periodo que se va a almacenar: ", usuario);
    
    return this.http.post<Usuario>(this._URL, usuario, {headers: this._httpOptions});
  }

  deleteUsuarios(id : number){
    const UrlDelete = this._URL + "/"+id;
    return this.http.delete(UrlDelete, {headers: this._httpOptions});
  }

  updateUsuarios(id: number, usuario: Usuario){
    console.warn("El usuario que se va a actualizar es", usuario);
    
    const UrlEstado = this._URL + "/"+id;
    return this.http.put(UrlEstado, usuario, {headers: this._httpOptions});
  }

  updateEstado(id: number, usuario: Usuario){
    console.error("El usuario "+ id + " - "+usuario.estado);
    const UrlEstado = this._URL + "/estado/"+id;
    return this.http.put(UrlEstado, usuario, {headers: this._httpOptions});
  }


}
