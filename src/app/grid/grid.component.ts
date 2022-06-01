import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, Input, OnInit, ViewChildren } from '@angular/core';
import { DEFAULT_GRID_SIZE, DOWN, LEFT, RIGHT, UP } from '../utils/CONSTANTS';
import { CellComponent } from './cell/cell.component';
import { Cell } from './cell/cell.model';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit,AfterViewInit{
  wolframRules = [0,0,0,0,0,0,0,0];
  type=1;

  n:number=DEFAULT_GRID_SIZE;
  cells:Cell[][];
  newCells:Cell[][];
  cellsComponents:CellComponent[][];
  counter:number[] = Array(DEFAULT_GRID_SIZE);
  boundaryXStart = 0;
  boundaryXEnd = 0;
  boundaryYStart = 0;
  boundaryYEnd = 0;

  boundaryCellTopLeft = null;
  boundaryCellTopRight = null;
  boundaryCellBottomLeft = null;
  boundaryCellBottomRight = null;

  @ViewChildren(CellComponent) cellQueryComponents;

  constructor() {
  }

  ngAfterViewInit(): void {
    if(this.n && this.n > 0){
      this.initializeCellArray();
      this.initializeNewCellArray();
      this.initializeCellComponentArray();
      this.cellQueryComponents._results.forEach((cell:CellComponent)=>{
        this.cells[cell.row][cell.column] = {isAlive:cell.isAlive, isAnt:cell.isAnt,  direction:cell.direction, row:cell.row, column:cell.column}
        this.newCells[cell.row][cell.column] = {isAlive:cell.isAlive, isAnt:cell.isAnt,  direction:cell.direction, row:cell.row, column:cell.column}
        this.cellsComponents[cell.row][cell.column] = cell;
      });
      this.cellQueryComponents.changes.subscribe(
        (_results)=>{
          _results.forEach((cell)=>{
          this.cells[cell.row][cell.column] = {isAlive:cell.isAlive, isAnt:cell.isAnt, direction:cell.direction,row:cell.row, column:cell.column}
          this.newCells[cell.row][cell.column] = {isAlive:cell.isAlive, isAnt:cell.isAnt, direction:cell.direction, row:cell.row, column:cell.column}
          this.cellsComponents[cell.row][cell.column] = cell;
        })
      });
    }
  }
  initializeCellArray(){
    this.cells = [];
    for (var i: number= 0; i< this.n; i++){
      this.cells[i] = [];
      for(var j: number =0; j<this.n; j++){
        this.cells[i][j] = null;
      }
    }
  }
  initializeNewCellArray(){
    this.newCells = [];
    for (var i: number= 0; i< this.n; i++){
      this.newCells[i] = [];
      for(var j: number =0; j<this.n; j++){
        this.newCells[i][j] = null;
      }
    }
  }
  initializeCellComponentArray(){
    this.cellsComponents = [];
    for (var i: number= 0; i< this.n; i++){
      this.cellsComponents[i] = [];
      for(var j: number =0; j<this.n; j++){
        this.cellsComponents[i][j] = null;
      }
    }
  }
  ngOnInit(): void {
  }
  setup(e:Cell){
    this.cells[e.row][e.column].isAlive=e.isAlive;
    this.cells[e.row][e.column].isAnt=e.isAnt;
    this.newCells[e.row][e.column].isAlive = e.isAlive;
    this.newCells[e.row][e.column].isAnt = e.isAnt;
  }
  iterate(){
    switch (this.type) {
      case 1:
        this.conwayLogic();
        break;
      case 2:
        this.langtonLogic();
        break;
      case 3:
          this.wolframLogic();
          break;
      default:
        break;
    }
  }
  conwayLogic(){
    if(this.cells){
      for (let i = 0; i< this.n; i++) {
        for (let j = 0; j < this.n; j++) {
          let currentCell = this.cells[i][j];
          let topLeftCell:Cell = null;
          let topCenterCell:Cell = null;
          let topRightCell:Cell = null;
          let middleLeftCell:Cell = null;
          let middleRightCell:Cell = null;
          let bottomLeftCell:Cell = null;
          let bottomCenterCell:Cell = null;
          let bottomRightCell:Cell = null;
          //revisar Limite Inferior
          let aliveCellsCounter = 0;
          if(i > 0){
            if(i < this.n-1){
              if( j > 0){
                if(j < this.n-1){
                  topLeftCell = this.cells[i-1][j-1];
                  topCenterCell = this.cells[i-1][j];
                  topRightCell = this.cells[i-1][j+1];
                  middleLeftCell = this.cells[i][j-1];
                  middleRightCell = this.cells[i][j+1];
                  bottomLeftCell = this.cells[i+1][j-1];
                  bottomCenterCell = this.cells[i+1][j];
                  bottomRightCell = this.cells[i+1][j+1];
                }else{
                  //Limite Derecho
                  topLeftCell = this.cells[i-1][j-1];
                  topCenterCell = this.cells[i-1][j];
                  middleLeftCell = this.cells[i][j-1];
                  bottomLeftCell = this.cells[i+1][j-1];
                  bottomCenterCell = this.cells[i+1][j];
                }
              }else{
                //limite Izquierdo
                topCenterCell = this.cells[i-1][j];
                topRightCell = this.cells[i-1][j+1];
                middleRightCell = this.cells[i][j+1];
                bottomCenterCell = this.cells[i+1][j];
                bottomRightCell = this.cells[i+1][j+1];
              }
            }else{
              //Limite Inferior, i = n-1
              if( j > 0){
                if(j < this.n-1){
                  topLeftCell = this.cells[i-1][j-1];
                  topCenterCell = this.cells[i-1][j];
                  topRightCell = this.cells[i-1][j+1];
                  middleLeftCell = this.cells[i][j-1];
                  middleRightCell = this.cells[i][j+1];
                }else{
                  //Limite Inferior Derecho i=n-1 y j = n-1
                  topLeftCell = this.cells[i-1][j-1];
                  topCenterCell = this.cells[i-1][j];
                  middleLeftCell = this.cells[i][j-1];
                }
              }else{
                //Limite Inferior Izquierdo i= n-1 y j = 0
                topCenterCell = this.cells[i-1][j];
                topRightCell = this.cells[i-1][j+1];
                middleRightCell = this.cells[i][j+1];
              }
            }
          }else{
            //Limite Superior, i = 0
            if( j > 0){
              if(j < this.n-1){
                middleLeftCell = this.cells[i][j-1];
                middleRightCell = this.cells[i][j+1];
                bottomLeftCell = this.cells[i+1][j-1];
                bottomCenterCell = this.cells[i+1][j];
                bottomRightCell = this.cells[i+1][j+1];
              }else{
                //limite superior Derecho
                middleLeftCell = this.cells[i][j-1];
                bottomLeftCell = this.cells[i+1][j-1];
                bottomCenterCell = this.cells[i+1][j];
              }
            }else{
              //limite Superior Izquierdo
              middleRightCell = this.cells[i][j+1];
              bottomCenterCell = this.cells[i+1][j];
              bottomRightCell = this.cells[i+1][j+1];
            }
          }

          if(topLeftCell !== null && topLeftCell.isAlive){
            aliveCellsCounter++;
          }
          if(topCenterCell !== null && topCenterCell.isAlive){
            aliveCellsCounter++;
          }
          if(topRightCell !== null && topRightCell.isAlive){
            aliveCellsCounter++;
          }
          if(middleLeftCell !== null && middleLeftCell.isAlive){
            aliveCellsCounter++;
          }
          if(middleRightCell !== null && middleRightCell.isAlive){
            aliveCellsCounter++;
          }
          if(bottomLeftCell !== null && bottomLeftCell.isAlive){
            aliveCellsCounter++;
          }
          if(bottomCenterCell !== null && bottomCenterCell.isAlive){
            aliveCellsCounter++;
          }
          if(bottomRightCell !== null && bottomRightCell.isAlive){
            aliveCellsCounter++;
          }
          if(currentCell.isAlive){
            if(aliveCellsCounter==0 || aliveCellsCounter==1 || aliveCellsCounter >= 4){
              this.newCells[i][j].isAlive = false;
            }
          }else{
            if(aliveCellsCounter==3){
              this.newCells[i][j].isAlive = true;
            }
          }
        }
      }
      this.cellQueryComponents._results.forEach((cell)=>{
        this.cellsComponents[cell.row][cell.column].isAlive = this.newCells[cell.row][cell.column].isAlive;
        this.cells[cell.row][cell.column].isAlive = this.cellsComponents[cell.row][cell.column].isAlive;
      });
    }
  }
  langtonLogic(){
    if(this.cells){
      for (let i = 0; i< this.n; i++) {
        for (let j = 0; j < this.n; j++) {
          let currentCell = this.cells[i][j];
          let topCenterCell:Cell = null;
          let middleLeftCell:Cell = null;
          let middleRightCell:Cell = null;
          let bottomCenterCell:Cell = null;
          //revisar Limite Inferior
          if(i > 0){
            if(i < this.n-1){
              if( j > 0){
                if(j < this.n-1){
                  topCenterCell = this.cells[i-1][j];
                  middleLeftCell = this.cells[i][j-1];
                  middleRightCell = this.cells[i][j+1];
                  bottomCenterCell = this.cells[i+1][j];
                }else{
                  //Limite Derecho
                  topCenterCell = this.cells[i-1][j];
                  middleLeftCell = this.cells[i][j-1];
                  bottomCenterCell = this.cells[i+1][j];
                }
              }else{
                //limite Izquierdo
                topCenterCell = this.cells[i-1][j];
                middleRightCell = this.cells[i][j+1];
                bottomCenterCell = this.cells[i+1][j];
              }
            }else{
              //Limite Inferior, i = n-1
              if( j > 0){
                if(j < this.n-1){
                  topCenterCell = this.cells[i-1][j];
                  middleLeftCell = this.cells[i][j-1];
                  middleRightCell = this.cells[i][j+1];
                }else{
                  //Limite Inferior Derecho i=n-1 y j = n-1
                  topCenterCell = this.cells[i-1][j];
                  middleLeftCell = this.cells[i][j-1];
                }
              }else{
                //Limite Inferior Izquierdo i= n-1 y j = 0
                topCenterCell = this.cells[i-1][j];
                middleRightCell = this.cells[i][j+1];
              }
            }
          }else{
            //Limite Superior, i = 0
            if( j > 0){
              if(j < this.n-1){
                middleLeftCell = this.cells[i][j-1];
                middleRightCell = this.cells[i][j+1];
                bottomCenterCell = this.cells[i+1][j];
              }else{
                //limite superior Derecho
                middleLeftCell = this.cells[i][j-1];
                bottomCenterCell = this.cells[i+1][j];
              }
            }else{
              //limite Superior Izquierdo
              middleRightCell = this.cells[i][j+1];
              bottomCenterCell = this.cells[i+1][j];
            }
          }

          let ant = currentCell;
          if(ant.isAnt){
            if(ant.direction == LEFT){
              this.newCells[ant.row][ant.column].isAlive = !ant.isAlive;
              this.newCells[ant.row][ant.column].isAnt = false;
              if(middleLeftCell !== null){
                if(middleLeftCell.isAlive){
                  this.newCells[middleLeftCell.row][middleLeftCell.column].direction = DOWN;
                }else{
                  this.newCells[middleLeftCell.row][middleLeftCell.column].direction = UP;
                }
                this.newCells[middleLeftCell.row][middleLeftCell.column].isAnt = true;
              }

            }
            if(ant.direction == RIGHT){
              this.newCells[ant.row][ant.column].isAlive = !currentCell.isAlive;
              this.newCells[ant.row][ant.column].isAnt = false;
              if(middleRightCell !== null){
                if(middleRightCell.isAlive){
                  this.newCells[middleRightCell.row][middleRightCell.column].direction = UP;
                }else{
                  this.newCells[middleRightCell.row][middleRightCell.column].direction = DOWN;
                }
                this.newCells[middleRightCell.row][middleRightCell.column].isAnt = true;
              }
            }
            if(ant.direction == UP){
              this.newCells[ant.row][ant.column].isAlive = !currentCell.isAlive;
              this.newCells[ant.row][ant.column].isAnt = false;
              if(topCenterCell !== null){
                if(topCenterCell.isAlive){
                  this.newCells[topCenterCell.row][topCenterCell.column].direction = LEFT;
                }else{
                  this.newCells[topCenterCell.row][topCenterCell.column].direction = RIGHT;
                }
                this.newCells[topCenterCell.row][topCenterCell.column].isAnt = true;
              }
            }
            if(ant.direction == DOWN){
              this.newCells[ant.row][ant.column].isAlive = !currentCell.isAlive;
              this.newCells[ant.row][ant.column].isAnt = false;
              if(bottomCenterCell !== null){
                if(bottomCenterCell.isAlive){
                  this.newCells[bottomCenterCell.row][bottomCenterCell.column].direction = RIGHT;
                }else{
                  this.newCells[bottomCenterCell.row][bottomCenterCell.column].direction = LEFT;
                }
                this.newCells[bottomCenterCell.row][bottomCenterCell.column].isAnt = true;
              }
            }
          }
        }
      }
      this.cellQueryComponents._results.forEach((cell)=>{
        this.cellsComponents[cell.row][cell.column].isAlive = this.newCells[cell.row][cell.column].isAlive;
        this.cellsComponents[cell.row][cell.column].isAnt = this.newCells[cell.row][cell.column].isAnt;
        this.cellsComponents[cell.row][cell.column].direction = this.newCells[cell.row][cell.column].direction;
        this.cells[cell.row][cell.column].isAlive = this.cellsComponents[cell.row][cell.column].isAlive;
        this.cells[cell.row][cell.column].isAnt = this.cellsComponents[cell.row][cell.column].isAnt;
        this.cells[cell.row][cell.column].direction = this.cellsComponents[cell.row][cell.column].direction;
      });
    }
  }
  wolframLogic(){
    if(this.cells){
      for (let i = 0; i< this.n; i++) {
        for (let j = 0; j < this.n; j++) {
          let currentCell = this.cells[i][j];
          let middleLeftCell:Cell = null;
          let middleRightCell:Cell = null;
          let bottomCenterCell:Cell = null;
          //Revisar limites
          if(i > 0){
            if(i < this.n-1){
              if( j > 0){
                if(j < this.n-1){
                  middleLeftCell = this.cells[i][j-1];
                  middleRightCell = this.cells[i][j+1];
                  bottomCenterCell = this.cells[i+1][j];
                }else{
                  //Limite Derecho
                  middleLeftCell = this.cells[i][j-1];
                  bottomCenterCell = this.cells[i+1][j];
                }
              }else{
                //limite Izquierdo
                middleRightCell = this.cells[i][j+1];
                bottomCenterCell = this.cells[i+1][j];
              }
            }else{
              //Limite Inferior, i = n-1
              if( j > 0){
                if(j < this.n-1){
                  middleLeftCell = this.cells[i][j-1];
                  middleRightCell = this.cells[i][j+1];
                }else{
                  //Limite Inferior Derecho i=n-1 y j = n-1
                  middleLeftCell = this.cells[i][j-1];
                }
              }else{
                //Limite Inferior Izquierdo i= n-1 y j = 0
                middleRightCell = this.cells[i][j+1];
              }
            }
          }else{
            //Limite Superior, i = 0
            if( j > 0){
              if(j < this.n-1){
                middleLeftCell = this.cells[i][j-1];
                middleRightCell = this.cells[i][j+1];
                bottomCenterCell = this.cells[i+1][j];
              }else{
                //limite superior Derecho
                middleLeftCell = this.cells[i][j-1];
                bottomCenterCell = this.cells[i+1][j];
              }
            }else{
              //limite Superior Izquierdo
              middleRightCell = this.cells[i][j+1];
              bottomCenterCell = this.cells[i+1][j];
            }
          }
          if(middleLeftCell !== null && middleRightCell !== null && bottomCenterCell !== null){
            if(!middleLeftCell.isAlive && !currentCell.isAlive && !middleRightCell.isAlive){
              this.cells[bottomCenterCell.row][bottomCenterCell.column].isAlive = this.wolframRules[0] == 1;
            }
            if(!middleLeftCell.isAlive && !currentCell.isAlive && middleRightCell.isAlive){
              this.cells[bottomCenterCell.row][bottomCenterCell.column].isAlive = this.wolframRules[1] == 1;
            }
            if(!middleLeftCell.isAlive && currentCell.isAlive && !middleRightCell.isAlive){
              this.cells[bottomCenterCell.row][bottomCenterCell.column].isAlive = this.wolframRules[2] == 1;
            }
            if(!middleLeftCell.isAlive && currentCell.isAlive && middleRightCell.isAlive){
              this.cells[bottomCenterCell.row][bottomCenterCell.column].isAlive = this.wolframRules[3] == 1;
            }
            if(middleLeftCell.isAlive && !currentCell.isAlive && !middleRightCell.isAlive){
              this.cells[bottomCenterCell.row][bottomCenterCell.column].isAlive = this.wolframRules[4] == 1;
            }
            if(middleLeftCell.isAlive && !currentCell.isAlive && middleRightCell.isAlive){
              this.cells[bottomCenterCell.row][bottomCenterCell.column].isAlive = this.wolframRules[5] == 1;
            }
            if(middleLeftCell.isAlive && currentCell.isAlive && !middleRightCell.isAlive){
              this.cells[bottomCenterCell.row][bottomCenterCell.column].isAlive = this.wolframRules[6] == 1;
            }
            if(middleLeftCell.isAlive && currentCell.isAlive && middleRightCell.isAlive){
              this.cells[bottomCenterCell.row][bottomCenterCell.column].isAlive = this.wolframRules[7] == 1;
            }
          }
        }
      }
      this.newCells = this.cells;
      this.cellQueryComponents._results.forEach((cell)=>{
        this.cellsComponents[cell.row][cell.column].isAlive = this.newCells[cell.row][cell.column].isAlive;
        this.cells[cell.row][cell.column].isAlive = this.cellsComponents[cell.row][cell.column].isAlive;
      });
    }
  }
  reset(){
    if(this.n && this.n > 0){
      this.initializeCellArray();
      this.initializeNewCellArray();
      this.initializeCellComponentArray();
      this.cellQueryComponents._results.forEach((cell)=>{
        cell.isAnt = false;
        cell.direction = LEFT;
        this.cells[cell.row][cell.column] = {isAlive:false, isAnt:false, direction:LEFT, row:cell.row, column:cell.column}
        this.newCells[cell.row][cell.column] = {isAlive:false, isAnt:false, direction:LEFT, row:cell.row, column:cell.column}
        this.cellsComponents[cell.row][cell.column] = cell;
        cell.isAlive = false;
      });
    }
  }
  updateGrid(n:number){
    this.n = n;
    if(this.n && this.n > 0){
      this.counter = Array(this.n);
      this.initializeCellArray();
      this.initializeNewCellArray();
      this.initializeCellComponentArray();
      this.cellQueryComponents._results.forEach((cell)=>{
        this.cells[cell.row][cell.column] = {isAlive:cell.isAlive, isAnt:cell.isAnt,  direction:cell.direction,row:cell.row, column:cell.column}
        this.newCells[cell.row][cell.column] = {isAlive:cell.isAlive,  isAnt:cell.isAnt,  direction:cell.direction, row:cell.row, column:cell.column}
        this.cellsComponents[cell.row][cell.column] = cell;
      });
    }
  }
  setGridType(type:number){
    this.type = type;
    this.cellQueryComponents._results.forEach((cell:CellComponent)=>{
      cell.type = type;
      this.cells[cell.row][cell.column] = {isAlive:cell.isAlive, isAnt:cell.isAnt,  direction:cell.direction, row:cell.row, column:cell.column}
      this.newCells[cell.row][cell.column] = {isAlive:cell.isAlive,  isAnt:cell.isAnt,  direction:cell.direction,row:cell.row, column:cell.column}
      this.cellsComponents[cell.row][cell.column] = cell;
    });
  }
  setupWolframRules(array:number[]){
    this.wolframRules = array;
  }
}
