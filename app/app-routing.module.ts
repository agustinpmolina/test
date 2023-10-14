import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CursoListComponent } from './components/curso-list/curso-list.component';
import { CursoDetailsComponent } from './components/curso-details/curso-details.component';
import { CursoAddComponent } from './components/curso-add/curso-add.component';

const routes: Routes = [
  { path: '', redirectTo: 'cursos', pathMatch: 'full' },
  { path: 'cursos', component: CursoListComponent },
  { path: 'cursos/:id', component: CursoDetailsComponent },
  { path: 'add', component: CursoAddComponent },
  { path: 'temas/:id', component: CursoAddComponent },
  { path: 'materiales/:id', component: CursoAddComponent },
  { path: 'cursos/:ultimo_id', component: CursoAddComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
