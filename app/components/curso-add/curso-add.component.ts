import { Component, OnInit, NgModule, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import { Curso } from 'src/app/models/curso.model';
import { CursoService } from 'src/app/services/curso.service';
import { CursoAddModule } from 'src/app/curso-add/curso-add.module';
import { Tema } from 'src/app/models/tema.model';
import { TemasService } from 'src/app/services/temas.service';
import { Material } from 'src/app/models/material.model'
import { MaterialService } from 'src/app/services/material.service';
import { Docente } from 'src/app/models/docente.model';
import  {DocenteService } from 'src/app/services/docente.service'
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-curso-add',
  templateUrl: './curso-add.component.html',
  styleUrls: ['./curso-add.component.css'],
  providers: [DatePipe]})
export class CursoAddComponent implements OnInit{
	
	
curso: Curso = <Curso>{
    nombre: '',
    fechaInicio: new Date(),
    idDocente:0, //campo obligatorio
    tema: { id : 0 //campo obligatorio
        } };

  material: Material = <Material>{
  titulo: '',
  costo: 0,
	idCurso: 0,
	stock: 0} 
 //- - - - - - - - - - - - - - - - - - - - - - 	LISTAS - - - - - - - - - - - - - - - - - - - - - - -  - - - - - - - - - - -  //
  materiales?: Material[];
  mat?: Material[];
  materialesTema?: Material[] = [];
  materialesFiltrados? : Material[] = [];
  
  cursos?: Curso[];
  cursosLista? : Curso[];
  cursosListaTema? : Curso[];
  
  temas?: Tema[];
  
  docentes?: Docente[];

//- - - - - - - - - - - - - - - - - - - - - - 	VAUABLES - - - - - - - - - - - - - - - - - - - - -  - - - - - - - - - - - - //

  currentElement: Material = {}
  
  selectedDate: Date | null = null;
  
  submitted = false;
  obligatoriosError = false;
  dateError = false ;
  showDatepick = false;
  
  currentDate: string = '';
  opcionSeleccionado: string  = '0';
  verSeleccion: string        = '';
  
  seleccionNumber : number = 0;
  seleccionado: number = 0;
  selectedTemaId : number = 0;
  selectedMaterialId : number = 0;
  selectedDocenteId: number = 0;
  materialSeleccionado : number = 0;

//- - - - - - - - - - - - - - - - - - - - - - 	CONSTRUCTORES - - - - - - - - - - - - - - - - - -  - - - - - - - - - - - - //

  constructor(private cursoService: CursoService, 
  private materialService: MaterialService, 
  private temaService : TemasService,
  private docenteService : DocenteService,
  private datePipe : DatePipe,
  private router: Router ) { }
  

//- - - - - - - - - - - - - - - - - - - - - - 	CARGA FUNCIONES INICIO   - - - - - - - - - - - - - -  - - - - - - - - - - //

  ngOnInit(): void {
	  
	  this.retrieveDocentes()   // CARGA LA LISTA DE DOCENTES
	  this.retrieveTema()		// CARGA LA LISTA DE TEMAS
	  this.retrieveMateriales()
	  this.updateMinDate()}  // CARGA LA LISTA DE MATERIALES
    
//- - - - - - - - - - - - - - - - - - - - - - 	FUNCIONES DE CARGA   - - - - - - - - - - - - - -  - - - - - - - - - - - - //
 
  //- - - - - - - - - - - - - - - - - - - - - -  Carga lista de Docentes ? - - - - - - - - - - - -  - - - - - - - - - - - - //
 retrieveDocentes(): void {
	 
    this.docenteService.getAll()
      .subscribe({
        next: (data) => {
          this.docentes = data;
          console.log(this.docentes);},
        error: (e) => console.error(e)});}	 
         
 //- - - - - - - - - - - - - - - - - - - - - -  Carga lista de temas - -  - - - - - - - - - - - -  - - - - - - - - - - - - //
 retrieveTema(): void {
	 
   this.temaService.getAll()
      .subscribe({
        next: (data) => {
          this.temas = data;
          console.log(this.temas);},
        error: (e) => console.error(e)});}
        	  
 //- - - - - - - - - - - - - - - - - - - - - -  Carga lista de materiales - - - - - - - - - - - -  - - - - - - - - - - - - //
 retrieveMateriales(): void {
	 
	 this.materialService.getAll()
      .subscribe({
        next: (data) => {
          this.materiales = data;
          console.log(this.materiales); },
        error: (e) => console.error(e)});  };
        
 //- - - - - - - - - - - - - - - - - - - - - -  filtro materiales por Tema - - - - - - - - - - - -  - - - - - - - - - - - - //
  retrieveMaterialesPorCurso(): void {
  this.materialService.findByCourseId(this.selectedTemaId)
    .subscribe({
      next: (data) => {
        this.materialesTema = data;
      },
      error: (e) => {
        console.error("Materiales no recuperados");
      }
    });
}

        
//- - - - - - - - - - - - - - - - - - - - - -  FIN FUNCIONES DE CARGA   - - - - - - - - - - - - - -  - - - - - - - - - - - - //





//- - - - - - - - - - - - - - - - - - - - - - 	GUARDAR CURSO (INSERT) - - - - - - - - - - - -  - - - - - - - - - - - - - -  //

saveCurso(): void {
  const cursoData = {
    id: this.curso.id,
    nombre: this.curso.nombre,
    fechaInicio: this.datePipe.transform(this.curso.fechaInicio, 'yyyy-MM-ddTHH:mm'),
    idDocente: this.curso.idDocente,
    tema: { id: this.selectedTemaId }
  };

  this.cursoService.create(cursoData).subscribe({
    next: (res: any) => {
      console.log(res);
      this.submitted = true;
      setTimeout(() => {
        this.router.navigate(['/cursos']);
      }, 7000);
    },
    error: (e: any) => {
      console.error(e);
      this.obligatoriosError = true;
    }
  });}


//- - - - - - - - - - - - - - - - - - - - - - 	NUEVO CURSO (INICIO) - - - -   - - - - - - - - - - - - - - - - - - - - - - - //

 newCurso(): void {
	 
    this.submitted = false;
    this.curso = <Curso>{
    	nombre: '',
    	fechaInicio: new Date(),
    	idDocente:  this.capturar(),
    	tema:  { id : this.selectedTemaId }, };}

//- - - - - - - - - - - - - - - - - - - - - - 	TOMAR VALOR ID DOCENTE  - - - - - - - - - - - - - -  - - - - - - - - - - - - //
 capturar() {
	 
      this.verSeleccion = this.opcionSeleccionado;
      this.capturarNumber();}
  
  
 capturarNumber(){
	 
	this.seleccionNumber = Number (this.verSeleccion) }
	
	
   
 updateMinDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.currentDate = `${year}-${month}-${day}`;
  }
	
}
	 