import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { TableServiceService } from '../../core/services/table-service.service';
import {  MatDialog} from '@angular/material/dialog';
import {  MatIconModule } from '@angular/material/icon';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { ConfigColmuns } from '../../core/interface/table-interface';
import { PopUpRowComponent } from '../pop-up-row/pop-up-row.component';
import { MatSort, MatSortModule  } from '@angular/material/sort';  



@Component({
  selector: 'app-list-register',
  imports: [
    MatButtonModule,
    MatTableModule,
    CommonModule,
    MatIconModule,
    MatSortModule
    
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
@ViewChild(MatSort) sort: MatSort = {} as MatSort;
dataSource =  new MatTableDataSource<ConfigColmuns>();
newData!:[];
//  методы
ngOnInit(): void {
  this.displayedColumns = this.ts.getColmuns();
  this.ts.documentlar$.subscribe((data)=>{
    this.dataSource.data = data;
  })
  this.dataSource.sort = this.sort;
}
openPopUp(){
  var matD = this.matDialog.open(PopUpComponent,{
    width: "60%",
    data: { title: 'Реквизить входящего документа' },
    enterAnimationDuration: "700ms",
    exitAnimationDuration: "700ms",
    
  })
}


openDocument(row:ConfigColmuns){
  this.matDialog.open(PopUpRowComponent,{
    width: "60%",
    data: row,
    enterAnimationDuration: "700ms",
    exitAnimationDuration: "700ms",
  })
  

}
openFile(file: any): void {
  // Agar file Base64 formatda bo'lsa
  if (typeof file === 'string' && file.startsWith('data:')) {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(
        `<iframe src="${file}" frameborder="0" style="width:100%;height:100%;"></iframe>`
      );
    } else {
      alert('❌ Yangi oynani ochib bo‘lmadi.');
    }
  } 
  // Agar file haqiqatan ham File yoki Blob bo'lsa
  else if (file instanceof Blob) {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Faylni Base64 formatiga o‘girish
    reader.onload = () => {
      const fileURL = reader.result as string;
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(
          `<iframe src="${fileURL}" frameborder="0" style="width:100%;height:100%;"></iframe>`
        );
      } else {
        alert('❌ Yangi oynani ochib bo‘lmadi.');
      }
    };
    reader.onerror = (error) => {
      console.error("Faylni o‘qishda xatolik:", error);
    };
  } else {
    console.error("Fayl obyekti noto‘g‘ri tipda:", file);
  }
}




}
