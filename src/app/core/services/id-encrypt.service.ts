import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IdEncryptService {
  private readonly SECRET = 'paris-escape-2024';

  // Simple encoding: convert number to base36 and add a checksum
  encryptId(id: number): string {
    if (!id || id <= 0) return '';
    // Convert to base36 and reverse
    const encoded = id.toString(36);
    // Add a simple checksum (last digit)
    const checksum = ((id * 7 + 13) % 36).toString(36);
    return encoded + checksum + 'X';
  }

  // Decode: reverse the process
  decryptId(encoded: string): number {
    if (!encoded || encoded.length < 2) return 0;
    try {
      // Remove the trailing 'X'
      const withoutX = encoded.slice(0, -1);
      // Get the base36 part (all but last char)
      const base36Part = withoutX.slice(0, -1);
      // Decode from base36
      const id = parseInt(base36Part, 36);
      return id > 0 ? id : 0;
    } catch {
      return 0;
    }
  }

  encryptIds(ids: number[]): string {
    return ids.map(id => this.encryptId(id)).join('-');
  }

  decryptIds(encoded: string): number[] {
    return encoded.split('-').map(e => this.decryptId(e)).filter(id => id > 0);
  }
}
