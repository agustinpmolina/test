import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepick.component.html',
  styleUrls: ['./datepick.component.css']
})
export class DatepickerComponent {
  selectedDate: Date;
  @Output() dateSelect: EventEmitter<Date> = new EventEmitter<Date>();
  
  constructor(){
	  this.selectedDate = new Date();
	  
  }
  
  fechaElegida(){
	  return this.selectedDate
  }
 
  
  onDateChange(event: any) {
    const selectedDate = event.target.value;
    this.selectedDate = selectedDate;
  }
  
 onDateSelect() {
  const currentDate = new Date();
  if (this.selectedDate < currentDate) {
    alert('Error: La fecha seleccionada es menor que la fecha actual.');
  } else {
    // La fecha seleccionada es válida, puedes emitir el evento
    this.dateSelect.emit(this.selectedDate);
  }
}

  }

