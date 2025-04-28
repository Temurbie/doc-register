import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
import { ConfigColmuns } from '../../core/interface/table-interface';
import { TableServiceService } from '../../core/services/table-service.service';




@Component({
  selector: 'app-pop-up',
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
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.scss'
})
export class PopUpComponent  implements OnInit{
  //injections

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : {title :string},
    private fb: FormBuilder,
    private dialogRef : MatDialogRef<PopUpComponent>,
    private tableS : TableServiceService,
  ){
    this.title = data.title
    
  }
  //uzaruvchilar
  myForm!: FormGroup;
  selectedFile: File | null = null
  title: string;
  fileError: boolean = false;
  fileFormatError = false;
  fileSizeError = false;
  selectedFileName = '';
  isSaved = false;

  //metods
  ngOnInit(): void {
    this.fControls();
  }
  
  fControls(){
    this.myForm = this.fb.group({
      regNo: [
        '',
        [
          Validators.required, 
          Validators.pattern('^[0-9]+[A-Za-z]+$'), 
          Validators.minLength(5), 
        ]
      ],
      regDate: ['', [Validators.required, this.currentData()]],
      docNo: ['',
        [
          Validators.required,
          Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d\\-_\\/]+$')
        ]
      ],
      dataDoc:["",[Validators.required, this.oldinYokiHoizrgi()]],
      delivery: [''],
      subject: ['',[Validators.required, Validators.maxLength(100)]],
      description: [''],
      correspondent: [""],
      deadline: ['', [Validators.required, this.executionDateAfterRegDateValidator('regDate')]],
      access: [false],
      control: [false],
      file: [null]
    });
  }
  
  

  onFileSelected(event: any): void {
    const file = event.target.files[0] || null; // Fayl yo‘q bo‘lishi ham mumkin
    
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
    this.myForm.patchValue({ file: file });
    this.myForm.get('file')?.updateValueAndValidity();
    
    console.log('✅ Fayl to‘g‘ri: ', file.name);
    
    this.convertFileToBase64(file)
    .then(base64 => {
    console.log('✅ Base64: ', base64);
    // Base64 faylni kerak joyda saqlash mumkin
    this.saveToTable(base64);
    })
    .catch(error => {
    console.error('Faylni o‘qishda xato:', error);
    });
    }
    } else {
    // Fayl tanlanmagan bo‘lsa ham formadagi file ni null qilib qo‘yamiz
    this.myForm.patchValue({ file: null });
    this.myForm.get('file')?.updateValueAndValidity();
    
    console.log('❗ Fayl tanlanmadi. Lekin formani saqlash davom etadi.');
    
    // Faylni null bo‘lsa ham Base64 ni qaytaramiz va saqlaymiz
    this.convertFileToBase64(null)
    .then(base64 => {
    console.log('✅ Base64 (fayl tanlanmagan): ', base64);
    this.saveToTable(base64);
    })
    .catch(error => {
    console.error('Faylni o‘qishda xato (fayl tanlanmagan):', error);
    });
    }
    }
    
    convertFileToBase64(file: File | null): Promise<string> {
    return new Promise((resolve, reject) => {
    if (!file) {
    // Agar fayl tanlanmasa, null bo‘lsa, xato qilmang va default base64 qiymatni qaytaring
    resolve('data:,'); // Yoki boshqa default qiymat
    } else if (!(file instanceof Blob)) {
    reject(new Error('Provided parameter is not a File or Blob.'));
    } else {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = () => {
    if (typeof reader.result === 'string') {
    resolve(reader.result);
    } else {
    reject(new Error('File reading error.'));
    }
    };
    
    reader.onerror = error => reject(error);
    }
    });
    }
    
    // Faylni saqlash funksiyasi
    saveToTable(base64: string): void {
    const formData = { ...this.myForm.value, file: base64 };
    
    let existingData;
    this.tableS.documentlar$.subscribe((data) => {
    existingData = data;
    });
    
    let parsedData: ConfigColmuns[] = [];
    
    if (existingData) {
    try {
    parsedData = JSON.parse(existingData);
    if (!Array.isArray(parsedData)) {
    parsedData = [];
    }
    } catch (e) {
    console.error("Xatolik JSON parse vaqtida:", e);
    parsedData = [];
    }
    }
    
    parsedData.push(formData); // Faylni yangi ma'lumotlar bilan saqlaymiz
    this.tableS.saveToLocalStorage(parsedData);
    this.isSaved = true;
    
    }

  onClose(): void {
    this.dialogRef.close();
  }
  submit() {
    if (this.myForm.valid) {
      console.log(this.myForm.value);
    } else {
      console.log('Formda xato bor!');
    }
  }


  onSave() {
    if (this.myForm.valid) {
      this.convertFileToBase64(this.myForm.value.file).then((base64: any) => {
        const formData = { ...this.myForm.value, file: base64 };
  
        const existingData = localStorage.getItem('myFormData');
        let parsedData: ConfigColmuns[] = [];
  
        if (existingData) {
          try {
            parsedData = JSON.parse(existingData);
            if (!Array.isArray(parsedData)) {
              parsedData = [];
            }
          } catch (e) {
            console.error("Xatolik JSON parse vaqtida:", e);
            parsedData = [];
          }
        }
  
        parsedData.push(formData);
        this.tableS.saveToLocalStorage(parsedData)
        this.isSaved = true;
      });
    } else {
      this.isSaved = false;
      console.warn('Forma xatoliklar bilan to‘ldirilgan');
    }
  }
  
  


onPrint() {
  window.print(); // bu kompyuterning print oynasini ochadi
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
}
