import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.html',
  styleUrls: ['./payment-success.css'],
})
export class PaymentSuccess {
  constructor(private router: Router) {}

  goToHome() {
    this.router.navigateByUrl('/home'); // redirects to http://localhost:4200/home
  }
}
