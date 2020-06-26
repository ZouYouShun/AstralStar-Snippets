import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string) {
    const data = localStorage.getItem(key);

    return JSON.parse(data);
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clean();
  }
}
