import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  templateUrl: './login.page.html',
})
export class LoginPage {
  form: FormGroup;
  loading = false;
  error = '';
  showPassword = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  fillDemoCredentials(role: 'admin' | 'seller'): void {
    if (role === 'admin') {
      this.form.patchValue({
        email: 'vendedor@test.com',
        password: 'password123',
      });
    } else {
      this.form.patchValue({
        email: 'vendedor@test.com',
        password: 'password123',
      });
    }
  }

  submit() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.error   = '';

    const { email, password } = this.form.value;
    this.auth.login(email, password).subscribe({
      next: () => void this.router.navigateByUrl('/dashboard'),
      error: (err: Error) => {
        this.error   = err.message;
        this.loading = false;
      },
    });
  }
}

