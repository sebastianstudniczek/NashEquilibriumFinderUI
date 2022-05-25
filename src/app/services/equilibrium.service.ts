import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CorrelatedEquilibrium } from '../models/correlated-equilibrium.model';
import { Game } from '../models/game.model';
import { HostInfo } from '../models/host-info.model';
import { AlgorithmResult } from '../models/algorithm-result.model';
import { PathProviderService } from './path-provider.service';

@Injectable({
  providedIn: 'root'
})
export class EquilibriumService {
  constructor(
    private httpClient: HttpClient,
    private pathProvider: PathProviderService
  ) {}

  getHostInfo(): Observable<HostInfo> {
    const url = `${this.pathProvider.provide()}/HostInfo`;

    return this.httpClient.get<HostInfo>(url);
  }

  getNashFromLemkeHowson(game: Game): Observable<AlgorithmResult> {
    const url = `${this.pathProvider.provide()}/NashFromLemkeHowson`;

    return this.httpClient.post<AlgorithmResult>(url, game);
  }

  getCorrelatedFromSimplex(game: Game): Observable<CorrelatedEquilibrium> {
    const url = `${this.pathProvider.provide()}/CorrelatedFromSimplex`;

    return this.httpClient.post<CorrelatedEquilibrium>(url, game);
  }
}
