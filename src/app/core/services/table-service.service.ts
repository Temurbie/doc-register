import { Injectable } from '@angular/core';
import { ConfigColmuns } from '../interface/table-interface';

@Injectable({
  providedIn: 'root'
})
export class TableServiceService {

   colmuns : string[] = ['file', 'Reg.No.', 'Reg.Date', 'Outgoing Doc.No.', 'Outgoing Doc.Date', 'Correspondent', 'Subject'] 

  getColmuns() :string[]{
    return this.colmuns;
  }
}
