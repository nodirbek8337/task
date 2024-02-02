import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectorRef } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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

  titleFilter: string = '';
  sortOrderId: string = '';
  sortOrderTitle: string = '';
  public data$: Observable<any> | undefined;
  totalData = 0;
  pageNumber = 1;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProblems({ first: 0, rows: 10 });
  }

  loadProblems(event: LazyLoadEvent, hasChecker: string = 'all') {
    this.pageNumber =
      event.first === 0 ? 1 : (event.first ?? 81) / (event.rows ?? 81) + 1;
    let ordering = '';

    if (this.sortOrderId === 'asc') {
      ordering = 'id';
    } else if (this.sortOrderId === 'desc') {
      ordering = '-id';
    } else if (this.sortOrderTitle === 'asc') {
      ordering = 'title';
    } else if (this.sortOrderTitle === 'desc') {
      ordering = '-title';
    }

    if (this.titleFilter) {
      const lowercaseTitle = this.titleFilter.toLowerCase();
      this.getData(
        this.pageNumber,
        event.rows ?? 81,
        lowercaseTitle,
        ordering,
        hasChecker
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
        ordering,
        hasChecker
      ).subscribe((response: any) => {
        this.totalData = response.total;
        this.data$ = of(response.data);
        this.cdr.detectChanges();
      });
    }
  }

  getData(
    page: number,
    page_size: number,
    title?: string,
    ordering?: string,
    hasChecker?: string
  ) {
    const params: any = {
      page: page.toString(),
      page_size: page_size.toString(),
    };

    if (title) {
      params.title = title;
    }

    if (ordering) {
      params.ordering = ordering;
    }

    if (hasChecker && hasChecker !== 'all') {
      params.has_checker = hasChecker === 'yes';
    }

    return this.http.get('https://kep.uz/api/problems', { params: params });
  }

  titleSearch(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.titleFilter = inputValue;
    this.loadProblems({ first: 0, rows: 10 });
  }

  toggleSortOrder(column: string) {
    if (column === 'id') {
      this.sortOrderId = this.sortOrderId === 'asc' ? 'desc' : 'asc';
      this.sortOrderTitle = '';
    } else if (column === 'title') {
      this.sortOrderTitle = this.sortOrderTitle === 'asc' ? 'desc' : 'asc';
      this.sortOrderId = '';
    }

    this.loadProblems({ first: 0, rows: 10 });
  }

  getRotationAngle(column: string): string {
    if (
      (column === 'id' && this.sortOrderId === 'asc') ||
      (column === 'title' && this.sortOrderTitle === 'asc')
    ) {
      return 'rotate(-90deg)';
    } else {
      return 'rotate(90deg)';
    }
  }

  onCheckerChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.loadProblems({ first: 0, rows: 10 }, selectedValue);
  }
}
