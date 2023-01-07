import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SalesTaxComponent } from './sales-tax/sales-tax.component';
import { DisplayResultComponent } from './display-result/display-result.component';

@NgModule({
  declarations: [
    AppComponent,
    SalesTaxComponent,
    DisplayResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
