import { Routes } from '@angular/router';
import { ReviewerListComponent } from './reviewer-list/reviewer-list.component';
import { ReviewerFormComponent } from './reviewer-form/reviewer-form.component';
import { ConnectionTestComponent } from './connection-test/connection-test.component';

export const routes: Routes = [
  { path: '', redirectTo: '/reviewers', pathMatch: 'full' },
  { path: 'reviewers', component: ReviewerListComponent },
  { path: 'reviewers/add', component: ReviewerFormComponent },
  { path: 'reviewers/edit/:id', component: ReviewerFormComponent },
  { path: 'test-connection', component: ConnectionTestComponent }
];
