import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'shared-dialog', //the name 'dialog' somehow conflicts and don't appears on the UI
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  @Output() emitter = new EventEmitter<boolean>();

  constructor(
  ) { }

  ngOnInit(): void {
  }

  close() {
    console.log('closed modal')
    this.emitter.emit(false);
  }

}
