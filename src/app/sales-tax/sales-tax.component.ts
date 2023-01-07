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
  salesTaxes: number = 0;
  totalTax: number = 0;
  changedInput: any;
  item: any;
  good: any;
  currentValue: any;

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

  roundTax(tax: any) {
    const rounded = Math.ceil(tax * 10) / 10;
    const lastDigit = Math.trunc(tax * 100) % 10;

    return lastDigit < 5 && lastDigit != 0 ? rounded - 0.05 : rounded;
  }

  transformInput(input: any) {
    let total = Number(input.substring(0, input.indexOf(" ")));
    const imported = input.includes("import");
    let article = input
      .replace(RegExp(/[0-9.]|at\s|imported/g), "")
      .trim()
      .replace(/\s+/g, " ");
    let cost = Number(input.substring(input.indexOf("at ") + 2).trim());

    if (isNaN(total)) {
      total = 1;
    }

    if (!article) {
      article = "unknown";
    }

    if (isNaN(cost)) {
      cost = 0;
    }

    return {
      total: total,
      import: imported,
      article: article,
      cost: cost,
    };
  }
}
