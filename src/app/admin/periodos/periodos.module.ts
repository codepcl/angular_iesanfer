import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { PeriodosComponent, DialogOverviewExampleDialog, PeriodoSnackComponent } from './periodos/periodos.component';
import { PeriodosRoutingModule } from './periodos-routing.module';
import { PeriodosService } from './periodos.service';



@NgModule({
  declarations: [PeriodosComponent, DialogOverviewExampleDialog, PeriodoSnackComponent],
  imports: [
    CommonModule,
    FormsModule,
    PeriodosRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [PeriodosService]
})
export class PeriodosModule { }
