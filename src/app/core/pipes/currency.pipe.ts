import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from '../services/currency.service';

@Pipe({
  name: 'appCurrency',
  standalone: true,
})
export class CurrencyPipe implements PipeTransform {
  private userCurrency = 'EUR';
  private cachedCurrency = '';

  constructor(private currencyService: CurrencyService) {
    this.currencyService.getCurrentCurrency().subscribe(c => {
      this.userCurrency = c;
    });
  }

  transform(amount: number, fromCurrency: string = 'EUR'): string {
    if (!amount && amount !== 0) return '';
    const converted = this.currencyService.convert(amount, fromCurrency, this.userCurrency);
    return this.currencyService.format(converted, this.userCurrency);
  }
}
