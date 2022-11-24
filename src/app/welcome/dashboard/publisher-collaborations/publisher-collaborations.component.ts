import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-publisher-collaborations',
  templateUrl: './publisher-collaborations.component.html',
  styleUrls: ['./publisher-collaborations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublisherCollaborationsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log()
  }

}
