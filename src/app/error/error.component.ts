import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from 'src/data/route';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent  {

  incomingRoute?

  constructor(
    activatedRoute: ActivatedRoute,
    private router:Router
  ) { 
    this.incomingRoute = activatedRoute.snapshot.paramMap.get(Route.errorRouteParams) 
  }


  tryAgain() {
    this.router.navigateByUrl(this.incomingRoute!!)
  }
 
}
