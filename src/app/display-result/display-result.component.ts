import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-display-result',
  templateUrl: './display-result.component.html',
  styleUrls: ['./display-result.component.scss']
})
export class DisplayResultComponent implements OnInit {

  @Input() salesTaxes!: number;
  @Input() totalTax!: number;
  @Input() resultList!: any;
  constructor() { }

  ngOnInit(): void {
  }

}
