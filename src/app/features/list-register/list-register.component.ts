import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import { TableServiceService } from '../../core/services/table-service.service';
import {  MatDialog} from '@angular/material/dialog';
import { PopUpComponent } from '../pop-up/pop-up.component';

@Component({
  selector: 'app-list-register',
  imports: [
    MatButtonModule,
    MatTableModule,
    CommonModule,
    
  ],
  templateUrl: './list-register.component.html',
  styleUrl: './list-register.component.scss'
})
export class ListRegisterComponent implements OnInit{
//injects
constructor (
  private ts : TableServiceService,
  public matDialog : MatDialog
){
  
}
// премение
title:string = "Регистер Записей Документов"

noDataTitle: string = "Пока информации нет, нажмите кнопку «Добавить», чтобы добавить."

displayedColumns!: string[];

dataSource = [
  {
    file: "sdds"
  }
];

//  методы
ngOnInit(): void {
 this.displayedColumns = this.ts.getColmuns();
}
openPopUp(){
  var matD = this.matDialog.open(PopUpComponent,{
    width: "60%",
    data: { title: 'Реквизить входящего документа' },
    enterAnimationDuration: "700ms",
    exitAnimationDuration: "700ms",
    
  })
}
}
