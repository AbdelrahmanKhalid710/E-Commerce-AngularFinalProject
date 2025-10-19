import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ICartItem } from '../../../../../../interfaces/icart-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-item',
  imports: [CommonModule],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.css'
})
export class CartItem {
  @Input() item!: ICartItem;
  @Output() remove = new EventEmitter<string>();

  onRemove(): void {
    this.remove.emit(this.item.product._id);
  }

}
