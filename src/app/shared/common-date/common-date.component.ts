import { Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'common-date',
  templateUrl: './common-date.component.html',
})
export class CommonDateComponent implements OnInit {
  @Input() control!: Date;
  @Output() emitter = new EventEmitter<Date>();

  date = new FormControl();
  constructor() {
  }

  ngOnInit() {
    console.log(this.control)
    this.date.setValue( this.control );
  }

  onChange() {
    console.log(this.date.value);
    this.emitter.emit(this.date.value);
  }

}
