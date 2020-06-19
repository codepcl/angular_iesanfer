import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService, Login } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements OnInit {

  login: Login;
  errorMessage: any;

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {}

  onLogin(formData){
    this.login = formData;
    console.log(this.login);
    
    this.loginService.login(this.login).subscribe(
      response => {
        console.log(response);
        // localStorage.setItem('ApiToken', response['token']);
        window.sessionStorage.setItem('ApiToken', response['token']);
        localStorage.setItem('isLoggedin', 'true');
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.errorMessage = error;
        if (this.errorMessage != null){
          console.log(this.errorMessage);
          alert("Error en la transaccion");
        }
      }
    )
  }

}
