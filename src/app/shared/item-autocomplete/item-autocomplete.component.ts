import { Component, DoCheck, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'item-autocomplete',
  templateUrl: './item-autocomplete.component.html'
})
export class ItemAutocompleteComponent implements OnInit, DoCheck {
  
  @Input() label!: string;
  @Input() allItems!: any[];
  @Input() name!: string;
  @Output() emitter = new EventEmitter<number>();

  itemSearchControl = new FormControl('', [Validators.required]);

  filteredItems!: Observable<any[]>;
  
  constructor() { }

  ngOnInit(): void {
    this.itemSearchControl.setValue( this.name );
    
    this.filteredItems = this.itemSearchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterItems(value))
      );
  }

  ngDoCheck(): void {
    // if(this.editMode)
    //     this.itemSearchControl.setValue( this.editName );
  }

  private _filterItems(value: string): any[] {
    console.log(value.length + " : " + this.itemSearchControl.value); // bug started here..!

    let index = this.allItems.findIndex(p => p.name === value);
    if(index != -1) {
      this.emitter.emit( this.allItems[index].id );
      return [ this.allItems[index] ];
    }
    if(value.length == this.itemSearchControl.value.length)
      this.emitter.emit(0); // exception removed! bug fixed!
    return this.allItems.filter(item => item.name.toLowerCase().includes( value.toLowerCase() ));
  }

}
