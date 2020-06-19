import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilesComponent, SnackComponent, DialogOverviewExampleDialog } from './perfiles/perfiles.component';

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

import { PerfilesRoutingModule } from './perfiles-routing.module';
import { PerfilesService } from './perfiles.service';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [PerfilesComponent, SnackComponent, DialogOverviewExampleDialog],
  imports: [
    CommonModule,
    PerfilesRoutingModule,
    FormsModule,
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
  providers: [PerfilesService]
})
export class PerfilesModule { }
