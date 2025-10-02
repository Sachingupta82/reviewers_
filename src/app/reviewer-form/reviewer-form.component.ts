import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReviewerService, Reviewer } from '../reviewer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviewer-form',
  templateUrl: './reviewer-form.component.html',
  styleUrls: ['./reviewer-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class ReviewerFormComponent implements OnInit {
  reviewerForm: FormGroup;
  isEditMode = false;
  reviewerId?: number;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private reviewerService: ReviewerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.reviewerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      expertise: ['', Validators.required],
      affiliation: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.reviewerId = Number(this.route.snapshot.params['id']);
    if (this.reviewerId) {
      this.isEditMode = true;
      this.loadReviewer(this.reviewerId);
    }
  }

  loadReviewer(id: number): void {
    this.reviewerService.getReviewer(id).subscribe({
      next: reviewer => {
        this.reviewerForm.patchValue(reviewer);
      },
      error: error => {
        console.error('Error loading reviewer:', error);
        this.errorMessage = error.message || 'Failed to load reviewer details';
      }
    });
  }

  onSubmit(): void {
    if (this.reviewerForm.valid) {
      const reviewer: Reviewer = this.reviewerForm.value;
      if (!reviewer.name || !reviewer.name.trim()) {
        this.errorMessage = 'Name is required.';
        return;
      }
      if (!reviewer.email || !reviewer.email.trim()) {
        this.errorMessage = 'Email is required.';
        return;
      }
      if (this.reviewerForm.get('email')?.invalid) {
        this.errorMessage = 'Please enter a valid email address.';
        return;
      }
      if (!reviewer.expertise || !reviewer.expertise.trim()) {
        this.errorMessage = 'Expertise is required.';
        return;
      }
      if (!reviewer.affiliation || !reviewer.affiliation.trim()) {
        this.errorMessage = 'Affiliation is required.';
        return;
      }
      this.errorMessage = '';
      if (this.isEditMode && this.reviewerId) {
        this.reviewerService.updateReviewer(this.reviewerId, reviewer).subscribe({
          next: () => {
            console.log('Reviewer updated successfully');
            this.router.navigate(['/reviewers']);
          },
          error: (error) => {
            console.error('Error updating reviewer:', error);
            this.errorMessage = error.message || 'Failed to update reviewer';
          }
        });
      } else {
        this.reviewerService.createReviewer(reviewer).subscribe({
          next: () => {
            console.log('Reviewer created successfully');
            this.router.navigate(['/reviewers']);
          },
          error: (error) => {
            console.error('Error creating reviewer:', error);
            this.errorMessage = error.message || 'Failed to create reviewer';
          }
        });
      }
    } else {
      console.log('Form is invalid:', this.reviewerForm.errors);
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  cancel(): void {
    this.router.navigate(['/reviewers']);
  }
} 