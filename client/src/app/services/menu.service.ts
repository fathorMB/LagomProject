import { inject, Injectable } from "@angular/core";
import { NetworkService } from "./network.service";
import { Observable } from "rxjs";
import { NavigationItem } from "../core/navigation/navigation-item.interface";

@Injectable({
  providedIn: 'root'
})
export class MenuService {
    private readonly networkService = inject(NetworkService);
    private readonly route = 'menu';

    getItems(): Observable<NavigationItem[]> {
        return this.networkService.get<NavigationItem[]>(this.route);
    }
}