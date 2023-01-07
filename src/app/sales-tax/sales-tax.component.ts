import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-tax',
  templateUrl: './sales-tax.component.html',
  styleUrls: ['./sales-tax.component.scss']
})
export class SalesTaxComponent implements OnInit {

  exemptedProducts: any[] = ['book', 'chocolate', 'pill'];
  public taxForm: FormGroup = this.formBuilder.group({
    inputGood: new FormControl(null, [
      Validators.required
    ])
  });
  tax: any;
  initialRate: number = 10;
  initialImportedRate: number = 5;
  itemArray: any = [];
  salesTaxes: any = null;
  totalTax: any = null;
  changedInput: any;
  item: any;
  good: any;
  currentValue: any;
  resultList: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  exemptedGoods(item: any): boolean {
    return this.exemptedProducts.some((i: any) => item.includes(i));
  }

  addItem(): void {
    this.currentValue = this.taxForm.value.inputGood;
    this.itemArray.push(this.taxForm.value.inputGood);
    this.taxForm.controls['inputGood'].setValue('');
  }

  onSubmit(): void {

    this.itemArray.forEach((i: any) => {
      this.changedInput = this.transformInput(i);

      this.good = {
        cost: this.changedInput.cost,
        import: this.changedInput.import,
        article: this.changedInput.article,
      };

      this.good.displayPrice =
        Math.round(
          (this.changedInput.cost + this.roundTax( this.computeTax(this.changedInput.cost,
            this.exemptedGoods( this.changedInput.article ), this.changedInput.import ))
          ) * 100 ) / 100;

      this.resultList.push(`${this.changedInput.total} ${this.changedInput.article} : ${this.good.displayPrice}`);

      this.salesTaxes += this.good.displayPrice - this.changedInput.cost;
      this.totalTax += this.good.displayPrice;

      this.salesTaxes = Math.round(this.salesTaxes * 100) / 100;
      this.totalTax = Math.round(this.totalTax * 100) / 100;
    })
  }

  computeTax(amount: any, free: any, importedPrice: any) {
    const tax = free ? importedPrice ? this.initialImportedRate : 0 : importedPrice ? this.initialRate + this.initialImportedRate
      : this.initialRate;
    return (amount * tax) / 100;
  }

  roundTax(input: any) {
    const endDigit: any = Math.trunc(input * 100) % 10;

    const roundedOfValue: any = Math.ceil(input * 10) / 10;

    return ((endDigit < 5) && (endDigit != 0)) ? (roundedOfValue - 0.05) : roundedOfValue;
  }

  transformInput(fieldValue: any) {

    let total: any = Number(fieldValue.substring(0, fieldValue.indexOf(" ")));

    let imported: any = fieldValue.includes("import");

    let cost: any = Number(fieldValue.substring(fieldValue.indexOf("at ") + 2).trim());

    let article: any = fieldValue.replace(RegExp(/[0-9.]|at\s|imported/g), "").trim().replace(/\s+/g, " ");

    total = isNaN(total) ? 1 : total;

    article = !article ? "unknown" : article;

    cost = isNaN(cost) ? 0 : cost;

    return { total: total, import: imported, article: article, cost: cost,
    };
  }
}
