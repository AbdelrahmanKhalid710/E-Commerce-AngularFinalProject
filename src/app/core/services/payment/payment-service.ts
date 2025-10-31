import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private token: string = 'E4B73FEE-F492-4607-A38D-852B0EBC91C9';
  private FcmToken: string = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

  constructor(private http: HttpClient) {}

  async createPayment(
    orderId:string,
    amount: number,
    customerEmail: string,
    customerName: string,
    customerPhone?: string
    
  ): Promise<string | null> {
    try {
      const response = await this.http
        .post('https://maktapp.credit/v3/AddTransaction', {
          token: this.token,
          FcmToken: this.FcmToken,
          currencyCode: 'EGP',
          orderId: orderId,
          amount: amount,
          customerEmail: customerEmail,
          customerName: customerName,
          ...(customerPhone && { customerPhone: customerPhone }),
          customerCountry: 'EG',
          lang: 'en',
          note: 'Test payment',
          save_token: true,
          successUrl: 'http://localhost:4200/payment-success',
          failureUrl: 'http://localhost:4200/home',
        })
        .toPromise();

      const result = response as any;
      console.log('Payment Created:', result);

      if (result.result && typeof result.result === 'string' && result.result.startsWith('http')) {
        console.log('✓ Checkout URL:', result.result);
        return result.result;
      } else {
        console.log('✗ Error code:', result.result);
        return null;
      }
    } catch (error) {
      console.error('✗ Error creating payment:', error);
      return null;
    }
  }
}
