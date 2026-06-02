import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface AddOn {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

@Component({
  selector: 'app-booking-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-sidebar.component.html',
  styleUrl: './booking-sidebar.component.scss'
})
export class BookingSidebarComponent {
  @Input() basePrice: number = 0;
  @Input() currency: string = '€';

  constructor(private router: Router) {}

  selectedDate: string = '';
  selectedTime: string = '9:00 AM';
  guests: number = 1;
  
  times = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];
  guestOptions = [1, 2, 3, 4, 5, 6];

  addOns: AddOn[] = [
    { id: '1', name: 'Private tour upgrade', price: 30, selected: false },
    { id: '2', name: 'Professional photographer', price: 45, selected: false }
  ];

  get selectedAddOns(): AddOn[] {
    return this.addOns.filter(a => a.selected);
  }

  get addOnsTotal(): number {
    return this.selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  }

  get subtotal(): number {
    return (this.basePrice * this.guests) + this.addOnsTotal;
  }

  get total(): number {
    return this.subtotal;
  }

  toggleAddOn(addOn: AddOn): void {
    addOn.selected = !addOn.selected;
  }

  bookNow(): void {
    console.log('Booking:', {
      date: this.selectedDate,
      time: this.selectedTime,
      guests: this.guests,
      addOns: this.selectedAddOns,
      total: this.total
    });
    
    this.router.navigate(['/landing/experience/1/book']);
  }

  contactGuide(): void {
    console.log('Contact guide');
  }
}
