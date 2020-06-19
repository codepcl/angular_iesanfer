import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, map, tap } from 'rxjs/operators';

export interface Periodo{
  id?: number;
  periodo?: string;
  created_at?: Date;
  updated_at?: Date;
  estado?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PeriodosService {

  _URL:any = "";
  _httpOptions:any; 

  constructor(private http: HttpClient) {
      this._URL = "http://localhost:3000/api/periodos";
      this._httpOptions = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('ApiToken')
        });
      
   }

  getPeriodos(){
    return this.http.get<Periodo[]>(this._URL, {headers: this._httpOptions}).pipe(
      retry(2)
    );

  }

  getPeriodo(id: number){
    const UrlGetPeriodo = this._URL + "/" + id;
    return this.http.get<Periodo>(UrlGetPeriodo);
  }

  createPeriodos(periodo: Periodo){
    console.warn("El periodo que se va a almacenar: "+ periodo);
    
    return this.http.post<Periodo>(this._URL, periodo, this._httpOptions);
  }

  deletePeriodos(id : number){
    const UrlDelete = this._URL + "/"+id;
    return this.http.delete(UrlDelete, this._httpOptions);
  }

  updatePeriodos(id: number, periodo: Periodo){
    const UrlEstado = this._URL + "/"+id;
    return this.http.put(UrlEstado, periodo, this._httpOptions);
  }

  updateEstado(id: number, periodo: Periodo){
    console.error("El periodo "+ id + " - "+periodo);
    const UrlEstado = this._URL + "/estado/"+id;
    return this.http.put(UrlEstado, periodo, this._httpOptions);
  }

}
