import { Component, OnInit, ViewChild, AfterViewInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Usuario, UsuariosService } from '../usuarios.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ThemePalette, MatOptionSelectionChange } from '@angular/material/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange, MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PerfilesService, Perfil } from '../../perfiles/perfiles.service';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.styl']
})
export class UsuariosComponent implements OnInit, AfterViewInit {

  usuarios : Usuario[] = [];
  displayedColumns = ['numero','id', 'usuario', 'fecha', 'estado', 'acciones'];
  dataSource: MatTableDataSource<Usuario>;
  selection: SelectionModel<Usuario>;

  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;

  usuario:Usuario ={};
  public errorMessage;

  component = "Usuarios";

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private usuariosService:UsuariosService, public dialog: MatDialog, private changeDetectorRefs: ChangeDetectorRef, private _snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource(); // create new object
    this.selection = new SelectionModel<Usuario>(true, []);
    }

  ngOnInit(): void {      
    this.showUsuarios();    
  }

  showUsuarios(){
    return this.usuariosService.getUsuarios()
    // .subscribe(periodos => (this.periodos = periodos));
    .subscribe(response => {
      this.usuarios = response['usuarios'];
      this.dataSource.data = response['usuarios'];
      console.warn(this.usuarios);   
      this.changeDetectorRefs.detectChanges();
      return response;
      // this.dataSource = new MatTableDataSource(periodos);
      // // this.dataSource.sort = this.sort
    }
    ,
    error =>{
      this.errorMessage = error;
      if (this.errorMessage != null) {
        console.log(this.errorMessage.error);
        alert("Error en la transacción");        
      }
    }
    );
  }

  openDialog(): void {
    this.usuario = {};
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '100%',
      data: {usuarios: this.usuario , accion: 'Registrar'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.usuario = result;
      console.log('The dialog was closed ' , this.usuario);
      if(result){
        // this.usuario.usuario = result;
        this.registrarUsuario();
      }
    });
  }

  registrarUsuario(){
    if (this.usuario) {
      this.usuariosService.createUsuarios(this.usuario).subscribe(
        response =>{
          console.log(response);
          this._snackBar.openFromComponent(UsuarioSnackComponent, {
            duration : 1000,
            data : 'registró'
          })  
          this.showUsuarios();      
        },
        error =>{
        this.errorMessage = error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la transacción");        
        }
      }
      )
    } else {
      alert("No se ha registrado usuario");
    }
  }

  onDelete(id : number){
    // alert(id);
    if(confirm("Estas seguro que desea eliminar este elemento? "))
    {
      this.usuariosService.deleteUsuarios(id).subscribe(
        response => {
          console.log(response);
          this._snackBar.openFromComponent(UsuarioSnackComponent, {
            duration : 1000,
            data : 'eliminó'
          })
          this.showUsuarios();
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

  onUpdate(id : number){
    this.usuariosService.getUsuario(id)
    .subscribe((usuarios : Usuario) => {
      this.usuario = usuarios;
      this.dialog.open(DialogOverviewExampleDialog, {
        width : '100%',
        data : {usuarios: this.usuario, accion: 'Actualizar'}
      }).afterClosed().subscribe(result => {
        console.log('The dialog was closed ', result);
        if(result){
          this.usuario = result;
          this.updateUsuario(id, this.usuario);
        }
      })
    });      
  }

  updateUsuario(id:number, usuario:Usuario){
    this.usuariosService.updateUsuarios(id, usuario).subscribe(
      response => {
        console.log(response);
        this._snackBar.openFromComponent(UsuarioSnackComponent, {
          duration : 1000,
          data : 'actualizó'
        })
        this.showUsuarios();
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


  onChange(ob: MatSlideToggleChange , id : number) {
    console.log(ob.checked);
    this.usuario.estado = 0;
    if(ob.checked){
      this.usuario.estado = 1;
    }
    this.usuariosService.updateEstado(id, this.usuario).subscribe(
      response => {
        console.log(response);
        this._snackBar.openFromComponent(UsuarioSnackComponent, {
          duration : 1000,
          data : 'actualizó'
        })
        this.showUsuarios();
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


  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  
}


@Component({
  selector: 'usuario-dialog',
  templateUrl: 'usuario-dialog.html',
  styleUrls: ['usuario-dialog.styl']
})
export class DialogOverviewExampleDialog implements OnInit {

  // accion = 'Registrar';
  component = 'usuarios';
  form:FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private perfilesService : PerfilesService
    ) {
      // data = new FormGroup({
      //   perfil: new FormControl('', [Validators.required, Validators.maxLength(3)]),
      //   documento: new FormControl('', [Validators.required, Validators.maxLength(8)]),
      //   usuario: new FormControl('', [Validators.required]),
      //   password: new FormControl('', [Validators.required]),
      //   nombres: new FormControl('',),
      //   apepat: new FormControl('',),
      //   apemat: new FormControl('',),
      //   email: new FormControl('',),
      //   telefono: new FormControl('',),
      //   direccion: new FormControl('',),
      // });
    }

    perfiles : Perfil[] = [];
    breakpoint: any;
    hide = true;
    // usuarios: Usuario = {};

  ngOnInit(): void {
    console.log(this.data);
    this.getPerfiles();
    this.form = this.fb.group({
      perfil: new FormControl(this.data.usuarios.user? this.data.usuarios.user.perfil:'', [Validators.required, Validators.maxLength(3)]),
      documento: new FormControl(this.data.usuarios.user? this.data.usuarios.user.documento:'', [Validators.required, Validators.maxLength(8)]),
      usuario: new FormControl(this.data.usuarios.user? this.data.usuarios.user.usuario:'', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      password_confirmation: new FormControl('', [Validators.required]),
      nombres: new FormControl(this.data.usuarios.user? this.data.usuarios.user.nombres:'',),
      apepat: new FormControl(this.data.usuarios.user? this.data.usuarios.user.apepat:'',),
      apemat: new FormControl(this.data.usuarios.user? this.data.usuarios.user.apemat:'',),
      email: new FormControl(this.data.usuarios.user? this.data.usuarios.user.email:'',),
      telefono: new FormControl(this.data.usuarios.user? this.data.usuarios.user.telefono:'',),
      direccion: new FormControl(this.data.usuarios.user? this.data.usuarios.user.direccion:'',)
    });
    this.breakpoint = (window.innerWidth <= 700) ? 1 : 3;
  }

  getPerfiles(){
    this.perfilesService.getPerfiles().subscribe(
      result => {
        this.perfiles = result;
        console.warn("Perfiles dialog", this.perfiles);
        
      }
    )
  }

  onResize(event){
    this.breakpoint = (event.target.innerWidth <= 700 ) ? 1 : 3;
  }

  save(){
    this.dialogRef.close(this.form.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'usuario-snack',
  templateUrl: 'usuario-snack.html',
  styleUrls: ['usuario-snack.styl'],
})
export class UsuarioSnackComponent {

  action : any = "xx";

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any){}
}


