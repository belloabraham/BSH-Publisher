import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'publisher';
  number = 0;
  
  get count() {
    return this.number++
  }

  hello() {
    this.number++
  }

}
