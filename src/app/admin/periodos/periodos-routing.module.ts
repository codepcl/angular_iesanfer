import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PeriodosComponent } from './periodos/periodos.component';

const routes: Routes = [
  {
    path: '',
    component: PeriodosComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeriodosRoutingModule { }