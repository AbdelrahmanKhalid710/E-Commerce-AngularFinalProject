import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/shopping-cart/cart-service/cart-service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.html',
  styleUrls: ['./payment-success.css'],
})
export class PaymentSuccess implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Get query parameters
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log('transid:', params['transid']);
      console.log('orderId:', params['orderId']);
      console.log('mode:', params['mode']);
      console.log('cuurencyCode:', params['cuurencyCode']);
      console.log('emailID:', params['emailID']);

      // Clear localStorage item with key 'emailID'
      localStorage.removeItem('emailID');

      // Clear the cart for the user based on emailID
      const cartKey = `cart-${params['emailID']}`;
      localStorage.removeItem(cartKey);
    });
  }

  goToHome() {
    this.router.navigateByUrl('/home');
  }
}
