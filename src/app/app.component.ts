import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { of } from 'rxjs';
import { Observable, pluck } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  difficultyColors: any = [
    'success',
    'success',
    'info',
    'info',
    'warning',
    'danger',
    'danger',
  ];

  private apiUrl = 'https://kep.uz/api/problems?';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  public data$: Observable<any> | undefined;
  totalData = 0;
  pageNumber = 1;

  ngOnInit(): void {
    this.data$ = this.getDat(1, 81).pipe(pluck('data'));
  }

  loadProblems(event: LazyLoadEvent) {
    event.first == 0
      ? (this.pageNumber = 1)
      : (this.pageNumber = (event.first ?? 81) / (event.rows ?? 81) + 1);

    this.getDat(this.pageNumber, event.rows ?? 81).subscribe(
      (response: any) => {
        this.totalData = response.total;
        this.data$ = of(response.data);

        this.cdr.detectChanges();
      }
    );
  }

  getDat(page: number, page_size: number) {
    return this.http.get('https://kep.uz/api/problems?', {
      params: {
        page: page.toString(),
        page_size: page_size.toString(),
      },
    });
  }
}
