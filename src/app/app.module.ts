import { NgModule } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { BadgeModule } from 'primeng/badge';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    BrowserAnimationsModule,
    TableModule,
    BadgeModule,
    KeyFilterModule,
    InputTextModule,
    PaginatorModule,
  ],
  providers: [
    provideHttpClient(withFetch()),
    provideClientHydration(),
    HttpClientModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
