import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; 
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; 
import { MatButtonModule } from '@angular/material/button'; 
import { ReactiveFormsModule } from '@angular/forms'; 



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
  ){
    this.title = data.title
    
  }
  //uzaruvchilar
  myForm!: FormGroup;
  selectedFile: File | null = null
  title: string;

  //metods
  ngOnInit(): void {
    this.myForm = this.fb.group({
      regNo: [
        '',
        [
          Validators.required, 
          Validators.pattern('^[0-9]+[A-Za-z]+$'), 
          Validators.minLength(5), 
        ]
      ],
      regDate: [''],
      docNo: [''],
      delivery: [''],
      subject: [''],
      description: [''],
      deadline: [''],
      access: [false],
      control: [false],
      file: [null]
    });
  }
 
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
      this.myForm.patchValue({ file }); // formaga yuklaymiz
    }
  }

  
  submit() {
    if (this.myForm.valid) {
      console.log(this.myForm.value);
    } else {
      console.log('Formda xato bor!');
    }
  }

}
