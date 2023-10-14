import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from 'src/app/services/curso.service';
import { Curso } from 'src/app/models/curso.model';
import { Tema } from 'src/app/models/tema.model';
import { Material } from 'src/app/models/material.model'
import { MaterialService } from 'src/app/services/material.service';
import { TemasService } from 'src/app/services/temas.service';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-curso-details',
  templateUrl: './curso-details.component.html',
  styleUrls: ['./curso-details.component.css'],
   providers: [DatePipe]
})
export class CursoDetailsComponent implements OnInit {
  @Input() viewMode = false;
  @Input() currentElement: Curso = <Curso>{
    title: '',
    status: 'draft',
    content: ''
  };
  
  message = '';
  
//- - - - - - - - - - - - - - - - - - - - - - 	CONSTRUCTORES - - - - - - - - - - - - - - - - - - - - - - -  - - - - - - - - - - -  //
  constructor(
    private cursoService: CursoService,
    private route: ActivatedRoute,
    private router: Router,
    private materialService: MaterialService,
    private temaService : TemasService ,
     private datePipe : DatePipe )
     { }
//- - - - - - - - - - - - - - - - - - - - - - 	VARIABLES - - - - - - - - - - - - - - - - - - - - - - -  - - - - - - - - - - -  //
  submitted: boolean = false;
  dateError : boolean = false;
     
  formattedDate : string = '';
  currentDate: string = '';
  
  private previousTemaId: any;
   
  idTema = this.temaService.get(this.currentElement)
    
    
  selectedTemaId : number = 0;
  materialesTema?: Material[] = [];
  
  
//- - - - - - - - - - - - - - - - - - - - - - 	CARGA - - - - - - - - - - - - - - - - - - - - - - -  - - - - - - - - - - -  //
  ngOnInit(): void {
	 this.updateMinDate();
    if (!this.viewMode) {
      this.message = '';
      this.getElement(this.route.snapshot.params["id"]);
    }}

//- - - - - - - - - - - - - - - - - - - - - - 	FUNCIONES - - - - - - - - - - - - - - - - - - - - - - -  - - - - - - - - - - -  //
    
  getElement(id: string): void {
    this.cursoService.get(id)
      .subscribe({
        next: (data) => {
          this.currentElement = data;
          console.log(data);
        },
        error: (e) => console.error(e)});}

  updateElement(): void {
	this.submitted = false;
	const fechaActual = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');

  if (this.currentElement.fechaInicio != null && fechaActual != null && this.currentElement.fechaInicio.toString() < fechaActual) {
     this.dateError = true;
    alert('No puedes seleccionar una fecha menor a la actual.');}   
	
	else {   
    this.dateError = false;
    this.message = '';
    this.cursoService.update(this.currentElement.id, this.currentElement)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message ? res.message : 'The course was successfully updated';
          setTimeout(() => {
          this.router.navigate(['/cursos']);}, 2000);},
        error: (e) => console.error(e)
      }); }  

  }
  
  deleteElement(): void {
    this.cursoService.delete(this.currentElement.id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/cursos']);
        },
        error: (e) => console.error(e)
      });
  } 
  
 
   retrieveMaterialesPorCurso(): void {
	this.materialService.findByCourseId(this.selectedTemaId)
      .subscribe({
        next: (data) => {
          this.materialesTema = data;
          console.log(this.materialesTema);
          console.log("Materiales recuperados:", this.materialesTema); },
        error: (e) => console.error("Materiales no recuperados")
      });  };
  


  asignarTemaId(idTema : any) {
 if (idTema !== this.previousTemaId) { 
  this.selectedTemaId = idTema 
  this.retrieveMaterialesPorCurso()
  this.previousTemaId = idTema;
  }}
  
 selectCourse(course: Curso) {
  this.currentElement = course;
  this.viewMode = true; 
} 

 updateMinDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.currentDate = `${year}-${month}-${day}`;
  }

  }
  
  