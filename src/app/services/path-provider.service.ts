import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PathProviderService {
  provide(): string {
    return `${environment.apiBaseUrl}${environment.applicationPath}`;
  }
}
