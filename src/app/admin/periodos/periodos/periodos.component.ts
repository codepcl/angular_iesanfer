import { Component, OnInit, ViewChild, AfterViewInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Periodo, PeriodosService } from '../periodos.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ThemePalette, MatOptionSelectionChange } from '@angular/material/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange, MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';


@Component({
  selector: 'app-periodos',
  templateUrl: './periodos.component.html',
  styleUrls: ['./periodos.component.styl']
})
export class PeriodosComponent implements OnInit, AfterViewInit {

  periodos : Periodo[] = [];
  displayedColumns = ['numero','id', 'periodo', 'fecha', 'estado', 'acciones'];
  dataSource: MatTableDataSource<Periodo>;
  selection: SelectionModel<Periodo>;

  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;

  periodo:Periodo ={};
  public errorMessage;

  component = "Periodos";

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private periodosService:PeriodosService, public dialog: MatDialog, private changeDetectorRefs: ChangeDetectorRef, private _snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource(); // create new object
    this.selection = new SelectionModel<Periodo>(true, []);
    }

  ngOnInit(): void {      
    this.showPeriodos();    
  }

  showPeriodos(){
    return this.periodosService.getPeriodos()
    // .subscribe(periodos => (this.periodos = periodos));
    .subscribe(response => {
      this.periodos = response;
      this.dataSource.data = response;
      console.warn(this.periodos);   
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
    this.periodo.periodo = "";
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {periodo: this.periodo.periodo, accion: 'Registrar'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed ' + result);
      if(result){
        this.periodo.periodo = result;
        this.registrarPeriodo();
      }
    });
  }

  registrarPeriodo(){
    if (this.periodo) {
      this.periodosService.createPeriodos(this.periodo).subscribe(
        response =>{
          console.log(response);
          this._snackBar.openFromComponent(PeriodoSnackComponent, {
            duration : 1000,
            data : 'registró'
          })  
          this.showPeriodos();      
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
      alert("No se ha registrado periodo");
    }
  }

  onDelete(id : number){
    // alert(id);
    if(confirm("Estas seguro que desea eliminar este elemento? "))
    {
      this.periodosService.deletePeriodos(id).subscribe(
        response => {
          console.log(response);
          this._snackBar.openFromComponent(PeriodoSnackComponent, {
            duration : 1000,
            data : 'eliminó'
          })
          this.showPeriodos();
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
    this.periodosService.getPeriodo(id)
    .subscribe((periodos : Periodo) => {
      // this.periodo = periodos;
      this.dialog.open(DialogOverviewExampleDialog, {
        // width : '250px',
        data : {periodo: periodos.periodo, accion: 'Actualizar'}
      }).afterClosed().subscribe(result => {
        console.log('The dialog was closed ' + result);
        if(result){
          this.periodo.periodo = result;
          this.updatePeriodo(id, this.periodo);
        }
      })
    });      
  }

  updatePeriodo(id:number, periodo:Periodo){
    this.periodosService.updatePeriodos(id, periodo).subscribe(
      response => {
        console.log(response);
        this._snackBar.openFromComponent(PeriodoSnackComponent, {
          duration : 1000,
          data : 'actualizó'
        })
        this.showPeriodos();
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
    this.periodo.estado = 0;
    if(ob.checked){
      this.periodo.estado = 1;
    }
    this.periodosService.updateEstado(id, this.periodo).subscribe(
      response => {
        console.log(response);
        this._snackBar.openFromComponent(PeriodoSnackComponent, {
          duration : 1000,
          data : 'actualizó'
        })
        this.showPeriodos();
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
  selector: 'periodo-dialog',
  templateUrl: 'periodo-dialog.html',
})
export class DialogOverviewExampleDialog {

  // accion = 'Registrar';
  component = 'periodos'

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'periodo-snack',
  templateUrl: 'periodo-snack.html',
  styleUrls: ['periodo-snack.styl'],
})
export class PeriodoSnackComponent {

  action : any = "xx";

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any){}
}

