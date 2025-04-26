import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; 
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; 
import { MatButtonModule } from '@angular/material/button'; 
import { ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms'; 
import { MatTableDataSource } from '@angular/material/table'; 
import { ConfigColmuns } from '../../core/interface/table-interface';
import { TableServiceService } from '../../core/services/table-service.service';
import { take } from 'rxjs';
@Component({
  selector: 'app-pop-up-row',
  imports: [
    MatFormField,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './pop-up-row.component.html',
  styleUrl: './pop-up-row.component.scss'
})
export class PopUpRowComponent implements OnInit {
  constructor(
    private fb : FormBuilder,
    private dialogRef: MatDialogRef<PopUpRowComponent>,
    private tabService : TableServiceService,
    @Inject(MAT_DIALOG_DATA) public data : ConfigColmuns,
  ){
    
  }
  //uzgaruvchilar
  myFormRow!: FormGroup;
  title = "Редактировать"
  fileFormatError!: boolean;
  fileSizeError = false;
  selectedFileName = '';
  isSaved!: boolean;
  dataSource =  new MatTableDataSource<ConfigColmuns>();
  
  
  ngOnInit(): void {
    this.fControlsRow()
    this.getDataService()
  }

  fControlsRow(){
    this.myFormRow = this.fb.group({
      regNo: [
        '',
        [
           
          Validators.pattern('^[0-9]+[A-Za-z]+$'), 
          Validators.minLength(5), 
        ]
      ],
      regDate: ['', [ this.currentData()]],
      docNo: ['',
        [
          
          Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d\\-_\\/]+$')
        ]
      ],
      dataDoc:["",[ this.oldinYokiHoizrgi()]],
      subject: ['',[ Validators.maxLength(100)]],
      correspondent: [""],
      file: [null]
    });
  }

    

 onFileSelected(event: any): void {
  const file = event.target.files[0];

  this.fileFormatError = false;
  this.fileSizeError = false;

  if (file) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB

    if (!allowedExtensions.includes(fileExtension || '')) {
      this.fileFormatError = true;
    }

    if (file.size > maxSizeInBytes) {
      this.fileSizeError = true;
    }

    if (!this.fileFormatError && !this.fileSizeError) {
      this.myFormRow.patchValue({ file: file });
      this.myFormRow.get('file')?.updateValueAndValidity(); // <<< mana to'g'risi!
    
    }
  }
}

  convertFileToBase64(file: File): Promise<string | ArrayBuffer | null>{
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
  


  onSave() {
    if (this.myFormRow.valid) {
      const file = this.myFormRow.value.file;
  
      if (file instanceof File) {
        this.convertFileToBase64(file).then((base64: any) => {
          this.saveFormData({ ...this.myFormRow.value, file: base64 });
        });
      } else {
   
        this.saveFormData(this.myFormRow.value);
      }
  
    } else {
      this.isSaved = false;
      
    }
  }
  
 saveFormData(formData: any) {
    const existingData = localStorage.getItem('myFormData');
    let parsedData: ConfigColmuns[] = [];
  
    if (existingData) {
      try {
        parsedData = JSON.parse(existingData);
        if (!Array.isArray(parsedData)) {
          parsedData = [];
        }
      } catch (e) {
        parsedData = [];
      }
    }
  
    const idx = parsedData.findIndex(d => d.regNo === this.data.regNo);
  
    if (idx !== -1) {
      parsedData[idx] = formData;
    } else {
      parsedData.push(formData); 
    }
  
    localStorage.setItem('myFormData', JSON.stringify(parsedData));
    this.tabService.documentlarSubject.next(parsedData);
  
  
    this.isSaved = true;
  }
  
  
  
  


onPrint() {
  window.print(); 
}

  

  currentData():ValidatorFn{
    return (control : AbstractControl) =>{
      if(!control.value) return null;
      const inpudDate = new Date(control.value);
      const bugun = new Date();
      const sameDate =
      inpudDate.getFullYear() === bugun.getFullYear() &&
      inpudDate.getMonth() === bugun.getMonth() &&
      inpudDate.getDate() === bugun.getDate();

    return sameDate ? null : { notToday: true };
    }
  }
   oldinYokiHoizrgi(): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return null;
  
      const inputDate = new Date(control.value);
      const today = new Date();

      const isValid =
        inputDate <= new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
      return isValid ? null : { futureDateNotAllowed: true };
    }
  }
  executionDateAfterRegDateValidator(regDateControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const formGroup = control.parent;
      if (!formGroup) return null;
  
      const regDate = formGroup.get(regDateControlName)?.value;
      const executionDate = control.value;
  
      if (!regDate || !executionDate) return null;
  
      const regDateObj = new Date(regDate);
      const execDateObj = new Date(executionDate);
  
      return execDateObj < regDateObj
        ? { executionBeforeReg: true }
        : null;
    };
  }

  getDataService() {
    this.tabService.documentlar$.pipe(take(1)).subscribe((subData) => {
      this.dataSource.data = subData;
      const findRow = this.dataSource.data.find(row => row.regNo === this.data.regNo);
  
      this.myFormRow.patchValue({
        regNo: findRow?.regNo,
        regDate: findRow?.regDate,
        docNo: findRow?.docNo,
        dataDoc: findRow?.dataDoc,
        correspondent: findRow?.correspondent,
        subject: findRow?.subject,
        file: findRow?.file,
      });
  
      this.myFormRow.markAllAsTouched();
      this.myFormRow.updateValueAndValidity();
      
      
    });
  }
  
 
}
