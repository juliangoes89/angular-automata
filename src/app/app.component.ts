import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Cell } from './grid/cell/cell.model';
import { GridComponent } from './grid/grid.component';
import { RowComponent } from './row/row.component';
import { DEFAULT_GRID_SIZE, DEFAULT_MILISECONDS } from './utils/CONSTANTS';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Juego de la Vida';
  n:number=DEFAULT_GRID_SIZE;
  ms:number=DEFAULT_MILISECONDS;

  isRunning = false;
  interval;
  steps:number = 0;
  type=1;
  wolframRules = [0,0,0,0,0,0,0,0]
  currentWolframRule = 0;

  @ViewChild("grid") grid:GridComponent;

  @ViewChild("rowRule1") rowRule1:RowComponent;
  @ViewChild("rowRule2") rowRule2:RowComponent;
  @ViewChild("rowRule3") rowRule3:RowComponent;
  @ViewChild("rowRule4") rowRule4:RowComponent;
  @ViewChild("rowRule5") rowRule5:RowComponent;
  @ViewChild("rowRule6") rowRule6:RowComponent;
  @ViewChild("rowRule7") rowRule7:RowComponent;
  @ViewChild("rowRule8") rowRule8:RowComponent;


  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
  }
  reset(){
    this.stop();
    this.steps = 0;
    this.grid.reset();
  }
  nextIteration(){
    this.steps += 1;
    this.grid.iterate();
  }
  simulate(){
    if(!this.isRunning){
      this.isRunning = true;
      this.startTimer();
    }
  }
  stop(){
    if(this.isRunning){
      this.isRunning = false;
      this.pauseTimer();
    }
  }
  updateGrid(n){
    if(n){
      this.n = Number(n);
      if(this.n>=0){
        this.grid.updateGrid(this.n);
      }
    }
  }
  updateTime(ms){
    if(ms){
      this.ms = Number(ms);
      if(this.ms >= 0){
        if(this.isRunning){
          this.pauseTimer();
          this.startTimer();
        }
      }
    }
  }
  updateTypes(type){
    this.type = Number(type);
    this.grid.setGridType(this.type);
    if(this.type !==3){
      this.grid.reset();
    }else{
      this.rowRule1.updateRowNumber(3);
      this.rowRule1.updateCellArray([1,1,1]);
      this.rowRule1.disableAllCells();

      this.rowRule2.updateRowNumber(3);
      this.rowRule2.updateCellArray([1,1,0]);
      this.rowRule2.disableAllCells();

      this.rowRule3.updateRowNumber(3);
      this.rowRule3.updateCellArray([1,0,1]);
      this.rowRule3.disableAllCells();

      this.rowRule4.updateRowNumber(3);
      this.rowRule4.updateCellArray([1,0,0]);
      this.rowRule4.disableAllCells();

      this.rowRule5.updateRowNumber(3);
      this.rowRule5.updateCellArray([0,1,1]);
      this.rowRule5.disableAllCells();

      this.rowRule6.updateRowNumber(3);
      this.rowRule6.updateCellArray([0,1,0]);
      this.rowRule6.disableAllCells();

      this.rowRule7.updateRowNumber(3);
      this.rowRule7.updateCellArray([0,0,1]);
      this.rowRule7.disableAllCells();

      this.rowRule8.updateRowNumber(3);
      this.rowRule8.updateCellArray([0,0,0]);
      this.rowRule8.disableAllCells();

      this.grid.setupWolframRules(this.wolframRules);
    }
  }
  setupWRule1(e:Cell){
    this.wolframRules[0] = e.isAlive? 1 : 0;
    this.calculateRule();
    this.grid.setupWolframRules(this.wolframRules);
  }
  setupWRule2(e){
    this.wolframRules[1] = e.isAlive? 1 : 0;
    this.calculateRule();
    this.grid.setupWolframRules(this.wolframRules);
  }
  setupWRule3(e){
    this.wolframRules[2] = e.isAlive? 1 : 0;
    this.calculateRule();
    this.grid.setupWolframRules(this.wolframRules);
  }
  setupWRule4(e){
    this.wolframRules[3] = e.isAlive? 1 : 0;
    this.calculateRule();
    this.grid.setupWolframRules(this.wolframRules);
  }
  setupWRule5(e){
    this.wolframRules[4] = e.isAlive? 1 : 0;
    this.calculateRule();
    this.grid.setupWolframRules(this.wolframRules);
  }
  setupWRule6(e){
    this.wolframRules[5] = e.isAlive? 1 : 0;
    this.calculateRule();
    this.grid.setupWolframRules(this.wolframRules);
  }
  setupWRule7(e){
    this.wolframRules[6] = e.isAlive? 1 : 0;
    this.calculateRule();
    this.grid.setupWolframRules(this.wolframRules);
  }
  setupWRule8(e){
    this.wolframRules[7] = e.isAlive? 1 : 0;
    this.calculateRule();
    this.grid.setupWolframRules(this.wolframRules);
  }
  calculateRule(){
    let result = 0;
    for (let i = 0; i < this.wolframRules.length; i++) {
      let binaryValue:number;
      if(this.wolframRules[i] === 1){
        binaryValue = Math.pow(2,i);
        result += binaryValue;
      }
    }
    this.currentWolframRule = result;
  }
  private startTimer() {
    if(this.ms !== 0){
      this.interval = setInterval(() => {
        this.nextIteration();
      },this.ms);
    }
  }

  private pauseTimer() {
    clearInterval(this.interval);
  }
}
