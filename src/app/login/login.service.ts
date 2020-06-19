import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


export interface Login{
  usuario : string;
  password : string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  _URL:any = "";
  _httpOptions:any; 

  constructor(private http: HttpClient) { 
    this._URL = "http://localhost:3000/api/login";
      this._httpOptions = {
        headers : new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        // withCredentials: true
      }
  }

  login(login : Login){
    return this.http.post(this._URL, login, this._httpOptions);
  }
}
