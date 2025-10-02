import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Reviewer {
  id?: number;  // Changed from reviewer_id to match backend entity
  name: string;
  email: string;
  expertise: string;
  affiliation: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewerService {
  // Updated URL to match Spring Boot backend port
  private apiUrl = 'https://reviewer-backend-hg27.onrender.com/reviewers';

  constructor(private http: HttpClient) {
    console.log('ReviewerService initialized with API URL:', this.apiUrl);
  }

  private handleError = (error: HttpErrorResponse) => {
    console.error('API Error:', error);
    if (error.status === 0) {
      // A client-side or network error occurred
      return throwError(() => new Error('Unable to connect to the server. Please make sure the backend server is running at ' + this.apiUrl));
    } else if (error.status === 404) {
      return throwError(() => new Error('The requested resource was not found. Please check the API endpoint.'));
    } else if (error.status >= 500) {
      return throwError(() => new Error('Server error occurred. Please try again later.'));
    }
    // Return a user-friendly error message
    return throwError(() => new Error(error.error?.message || 'An unexpected error occurred.'));
  }

  getReviewers(): Observable<Reviewer[]> {
    console.log('Fetching reviewers from:', this.apiUrl);
    return this.http.get<Reviewer[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getReviewer(id: number): Observable<Reviewer> {
    return this.http.get<Reviewer>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createReviewer(reviewer: Reviewer): Observable<Reviewer> {
    console.log('Creating reviewer at:', this.apiUrl, 'with data:', reviewer);
    return this.http.post<Reviewer>(this.apiUrl, reviewer)
      .pipe(catchError(this.handleError));
  }

  updateReviewer(id: number, reviewer: Reviewer): Observable<Reviewer> {
    return this.http.put<Reviewer>(`${this.apiUrl}/${id}`, reviewer)
      .pipe(catchError(this.handleError));
  }

  deleteReviewer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }
} 