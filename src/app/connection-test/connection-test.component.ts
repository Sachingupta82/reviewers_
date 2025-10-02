import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connection-test',
  templateUrl: './connection-test.component.html',
  styleUrls: ['./connection-test.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ConnectionTestComponent implements OnInit {
  backendStatus: string = 'Checking...';
  isConnected: boolean = false;
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.testBackendConnection();
  }

  testBackendConnection(): void {
    this.http.get('https://reviewer-backend-hg27.onrender.com/api/health')
      .subscribe({
        next: (response: any) => {
          this.backendStatus = response.message || 'Connected successfully!';
          this.isConnected = true;
          this.errorMessage = '';
        },
        error: (error) => {
          this.backendStatus = 'Connection failed!';
          this.isConnected = false;
          this.errorMessage = error.message || 'Unable to connect to backend';
        }
      });
  }

  retryConnection(): void {
    this.testBackendConnection();
  }
}


