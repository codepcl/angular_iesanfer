import { Component, OnInit, ViewChild, AfterViewInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Perfil, PerfilesService } from '../perfiles.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ThemePalette, MatOptionSelectionChange } from '@angular/material/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange, MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { ThrowStmt } from '@angular/compiler';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.styl']
})
export class PerfilesComponent implements OnInit {

  perfiles : Perfil[] = [];
  displayedColumns = ['numero','id', 'perfil', 'fecha', 'estado', 'acciones'];
  dataSource: MatTableDataSource<Perfil>;
  selection: SelectionModel<Perfil>;

  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;

  perfil:Perfil = {};
  public errorMessage;

  component = "Perfiles";

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private perfilService:PerfilesService, public dialog: MatDialog, private changeDetectorRefs: ChangeDetectorRef, private _snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource(); // create new object
    this.selection = new SelectionModel<Perfil>(true, []);
    }

  ngOnInit(): void {      
    this.show();    
  }

  show(){
    return this.perfilService.getPerfiles()
    // .subscribe(periodos => (this.periodos = periodos));
    .subscribe(response => {
      this.perfiles = response;
      this.dataSource.data = response;
      // console.warn(this.perfiles);   
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
    this.perfil.perfil = "";
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {perfil: this.perfil.perfil, accion: 'Registrar'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed ' + result);
      if(result){
        this.perfil.perfil = result;
        this.registrarPerfiles();
      }
    });
  }

  registrarPerfiles(){
    if (this.perfil) {
      this.perfilService.createPerfiles(this.perfil).subscribe(
        response =>{
          console.log(response);
          this._snackBar.openFromComponent(SnackComponent, {
            duration : 1000,
            data : 'registró'
          })  
          this.show();      
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
      alert("No se ha registrado perfil");
    }
  }

  onDelete(id : number){
    // alert(id);
    if(confirm("Estas seguro que desea eliminar este elemento? "))
    {
      this.perfilService.deletePerfiles(id).subscribe(
        response => {
          console.log(response);
          this._snackBar.openFromComponent(SnackComponent, {
            duration : 1000,
            data : 'eliminó'
          })
          this.show();
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
    this.perfilService.getPerfil(id)
    .subscribe((perfiles : Perfil) => {
      // this.periodo = periodos;
      this.dialog.open(DialogOverviewExampleDialog, {
        // width : '250px',
        data : {perfil: perfiles.perfil, accion: 'Actualizar'}
      }).afterClosed().subscribe(result => {
        console.log('The dialog was closed ' + result);
        if(result){
          this.perfil.perfil = result;
          this.updatePerfil(id, this.perfil);
        }
      })
    });      
  }

  updatePerfil(id:number, perfil:Perfil){
    this.perfilService.updatePerfiles(id, perfil).subscribe(
      response => {
        console.log(response);
        this._snackBar.openFromComponent(SnackComponent, {
          duration : 1000,
          data : 'actualizó'
        })
        this.show();
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
    this.perfil.estado = 0;
    if(ob.checked){
      this.perfil.estado = 1;
    }
    this.perfilService.updateEstado(id, this.perfil).subscribe(
      response => {
        console.log(response);
        this._snackBar.openFromComponent(SnackComponent, {
          duration : 1000,
          data : 'actualizó'
        })
        this.show();
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
  selector: 'perfil-dialog',
  templateUrl: 'perfil-dialog.html',
})
export class DialogOverviewExampleDialog {

  // accion = 'Registrar';
  component = 'perfiles'

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'perfil-snack',
  templateUrl: 'perfil-snack.html',
  styleUrls: ['perfil-snack.styl'],
})
export class SnackComponent {

  action : any = "xx";

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any){}
}
