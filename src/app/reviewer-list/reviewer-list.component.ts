import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReviewerService, Reviewer } from '../reviewer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviewer-list',
  templateUrl: './reviewer-list.component.html',
  styleUrls: ['./reviewer-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ReviewerListComponent implements OnInit {
  reviewers: Reviewer[] = [];
  errorMessage: string = '';

  constructor(
    private router: Router,
    private reviewerService: ReviewerService
  ) {}

  ngOnInit(): void {
    this.loadReviewers();
  }

  loadReviewers(): void {
    this.reviewerService.getReviewers().subscribe({
      next: (reviewers) => {
        this.reviewers = reviewers;
      },
      error: (error) => {
        console.error('Error loading reviewers:', error);
        this.errorMessage = error.message || 'Failed to load reviewers';
      }
    });
  }

  deleteReviewer(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this reviewer?')) {
      this.reviewerService.deleteReviewer(id).subscribe({
        next: () => {
          this.reviewers = this.reviewers.filter(r => r.id !== id);
        },
        error: (error) => {
          console.error('Error deleting reviewer:', error);
          this.errorMessage = error.message || 'Failed to delete reviewer';
        }
      });
    }
  }

  addReviewer(): void {
    this.router.navigate(['/reviewers/add']);
  }
} 