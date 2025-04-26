import { Injectable } from '@angular/core';
import { ConfigColmuns } from '../interface/table-interface';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TableServiceService {  
  constructor(){
    this.getLocalData();
  }
  localData = new MatTableDataSource();
  // private documentsSubject = new BehaviorSubject<ConfigColmuns[]>([])
  // documentlar$ = this.documentsSubject.asObservable();
   documentlarSubject = new BehaviorSubject<ConfigColmuns[]>([]); 
  documentlar$ = this.documentlarSubject.asObservable();


   colmuns : string[] = [ 
    'file',
    'regNo',
    'regDate',
    'outgoingDocNo',
    'outgoingDocDate',
    'correspondent',
    'subject'] 

  getColmuns() :string[]{
    return this.colmuns;
  }

  getLocalData(){
    
    const data = localStorage.getItem('myFormData');
    if (data) {
      const parsed: ConfigColmuns[] = JSON.parse(data);
      this.documentlarSubject.next(parsed);
    
    }
  }

  saveToLocalStorage(docs: ConfigColmuns[]) {
    localStorage.setItem('myFormData', JSON.stringify(docs));
    this.documentlarSubject.next(docs);
  }

  getCurrentDocuments(): ConfigColmuns[] {
    return this.documentlarSubject.getValue();
  }

}
