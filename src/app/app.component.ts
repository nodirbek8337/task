import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  value: string = 'hello';

  difficultyColors: any = [
    'success',
    'success',
    'info',
    'info',
    'warning',
    'danger',
    'danger',
  ];

  titleFilter: string = '';
  sortOrder: string = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  public data$: Observable<any> | undefined;
  totalData = 0;
  pageNumber = 1;

  ngOnInit(): void {
    this.loadProblems({ first: 0, rows: 10 });
  }

  loadProblems(event: LazyLoadEvent) {
    event.first == 0
      ? (this.pageNumber = 1)
      : (this.pageNumber = (event.first ?? 81) / (event.rows ?? 81) + 1);

    let ordering = '';

    if (this.sortOrder === 'asc') {
      ordering = 'id';
    } else if (this.sortOrder === 'desc') {
      ordering = '-id';
    }

    if (this.titleFilter) {
      const lowercaseTitle = this.titleFilter.toLowerCase();

      this.getData(
        this.pageNumber,
        event.rows ?? 81,
        lowercaseTitle,
        ordering
      ).subscribe((response: any) => {
        this.totalData = response.total;
        this.data$ = of(response.data);

        this.cdr.detectChanges();
      });
    } else {
      this.getData(
        this.pageNumber,
        event.rows ?? 81,
        undefined,
        ordering
      ).subscribe((response: any) => {
        this.totalData = response.total;
        this.data$ = of(response.data);

        this.cdr.detectChanges();
      });
    }
  }

  getData(page: number, page_size: number, title?: string, ordering?: string) {
    let params: any = {
      page: page.toString(),
      page_size: page_size.toString(),
    };

    if (title) {
      params.title = title;
    }

    if (ordering) {
      params.ordering = ordering;
    }

    return this.http.get('https://kep.uz/api/problems', {
      params: params,
    });
  }

  titleSearch(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.titleFilter = inputValue;
    this.loadProblems({ first: 0, rows: 10 });
  }

  toggleSortOrder() {
    // Toggle the sorting order when the button is clicked
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.loadProblems({ first: 0, rows: 10 });
  }

  getRotationAngle(): string {
    return this.sortOrder === 'asc' ? 'rotate(-90deg)' : 'rotate(90deg)';
  }
}
