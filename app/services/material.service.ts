import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material } from '../models/material.model'
import { mergeMap } from 'rxjs/operators';

const baseUrl = 'http://localhost:8080/api/materiales';
//const baseUrl = 'http://localhost:8080/materiales';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  constructor(private http: HttpClient) { }
  
  
  getAll(): Observable<Material[]> {
    return this.http.get<Material[]>(baseUrl);
  }
  get(id: any): Observable<Material> {
    return this.http.get<Material>(`${baseUrl}/${id}`);
  }
  create(data: any): Observable<any> {
	console.log(data);
	//Conversione a form data
	//const formData = new FormData();
	//formData.append('title', <string>data.title);
    //formData.append('status', <string>data.status);
	//formData.append('content', <string>data.content);
    return this.http.post(`${baseUrl}`, data, {responseType: 'text'});
  }
  update(id: any, data: Material): Observable<any> {
	//Conversione a form data
	const bodyData = {
		"id": id,
    	"nombre": data.titulo,
    	"costo": data.costo,
    	"idCurso": data.idCurso ,
    	"stock":data.stock
    	/* "tema": data.tema */ };
    	
    return this.http.put(`${baseUrl}`, bodyData, {responseType: 'text'});
  }
  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/delete/${id}`, {responseType: 'text'});
  }
  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }
  findById(id:number): Observable<Material> {
    return this.http.get<Material>(`${baseUrl}?id=${id}`);
  }
  
 findByCourseId(idCurso: number): Observable<Material[]> {
    return this.http.get<Material[]>(`${baseUrl}/curso/${idCurso}`);}}
  


  
 
  
  
