import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LEFT } from 'src/app/utils/CONSTANTS';
import { Cell } from './cell.model';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {
  @Input() row:number;
  @Input() column:number;
  @Output() changedEvent = new EventEmitter<Cell>();

  isAlive:boolean = false;
  isAnt:boolean = false;
  direction: string = LEFT;

  type:number = 1;

  disabled = false;


  constructor() { }

  ngOnInit(): void {
  }

  toggleAlive(){
    this.isAlive = !this.isAlive;
    let cell = { row: this.row, column:this.column, isAlive: this.isAlive, isAnt: this.isAnt, direction:this.direction};
    this.changedEvent.emit(cell);
  }

  toggleAnt(){
    this.isAnt = !this.isAnt;
    let cell = { row: this.row, column:this.column, isAlive: this.isAlive, isAnt: this.isAnt, direction:this.direction };
    this.changedEvent.emit(cell);
  }

  cellClicked(){
    if(!this.disabled){
      switch (this.type) {
        case 1:
          this.toggleAlive();
          break;
        case 2:
          this.toggleAnt();
          break;
        case 3:
          this.toggleAlive();
          break;
        default:
          break;
      }
    }
  }

}
