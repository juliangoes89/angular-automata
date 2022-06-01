import { Component, Input, OnInit, ViewChildren } from '@angular/core';
import { CellComponent } from '../grid/cell/cell.component';
import { Cell } from '../grid/cell/cell.model';
import { DEFAULT_ARRAY_SIZE} from '../utils/CONSTANTS';

@Component({
  selector: 'app-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.css']
})
export class RowComponent implements OnInit {

  @ViewChildren(CellComponent) cellQueryComponents;

  type=1;

  n:number=DEFAULT_ARRAY_SIZE;
  cells:Cell[];
  newCells:Cell[];
  cellsComponents:CellComponent[];
  counter:number[] = Array(DEFAULT_ARRAY_SIZE);

  disabled = false;

  constructor() { }

  ngOnInit(): void {
  }

  setup(e:Cell){
    this.cells[e.row].isAlive=e.isAlive;
    this.cells[e.row].isAnt=e.isAnt;
    this.newCells[e.row].isAlive = e.isAlive;
    this.newCells[e.row].isAnt = e.isAnt;
  }
  updateRowNumber(n:number){
    this.n = n;
    if(this.n && this.n > 0){
      this.counter = Array(this.n);
      this.initializeCellArray();
      this.initializeNewCellArray();
      this.initializeCellComponentArray();
      this.cellQueryComponents._results.forEach((cell:CellComponent)=>{
        this.cells[cell.row] = {isAlive:cell.isAlive, isAnt:cell.isAnt,  direction:cell.direction,row:cell.row, column:cell.column}
        this.newCells[cell.row] = {isAlive:cell.isAlive,  isAnt:cell.isAnt,  direction:cell.direction, row:cell.row, column:cell.column}
        this.cellsComponents[cell.row] = cell;
      });
    }
  }
  updateCellArray(array:number[]){
    if(array && array !=null){
      if(array.length === this.n){
        this.cellQueryComponents._results.forEach((cell:CellComponent)=>{
          let isAlive = array[cell.row] == 1
          cell.isAlive = isAlive;
          this.cells[cell.row].isAlive = isAlive;
          this.newCells[cell.row].isAlive = isAlive;
          this.cellsComponents[cell.row] = cell;
        });
      }
    }
  }
  disableAllCells(){
        this.cellQueryComponents._results.forEach((cell:CellComponent)=>{
          cell.disabled = true;
        });
  }
  enableAllCells(){
    this.cellQueryComponents._results.forEach((cell:CellComponent)=>{
      cell.disabled = false;
    });
}
  initializeCellArray(){
    this.cells = [];
    for (var i: number= 0; i< this.n; i++){
      this.cells[i] = null;
    }
  }
  initializeNewCellArray(){
    this.newCells = [];
    for (var i: number= 0; i< this.n; i++){
      this.newCells[i] = null;
    }
  }
  initializeCellComponentArray(){
    this.cellsComponents = [];
    for (var i: number= 0; i< this.n; i++){
      this.cellsComponents[i] = null;
    }
  }
}
