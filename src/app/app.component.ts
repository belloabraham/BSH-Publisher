import { ChangeDetectorRef, Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'publisher';
  number = 0;
  
  constructor(ref: ChangeDetectorRef) {
    ref.detach()
  }

  hi(value:any){
    console.log(value.value)
  }

  get count() {
    return this.number++
  }

  hello() {
    this.number++
    console.log(this.number)
  }

}
