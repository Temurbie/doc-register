import { Component } from '@angular/core';
import { ListRegisterComponent } from "./features/list-register/list-register.component";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [
    ListRegisterComponent,
    
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'doc-register';
}
