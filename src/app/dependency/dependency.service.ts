import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DependencyService {
  constructor() { }

  asyncExample(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Hello");
      }, 3000);
    });
  }

  observableExample(): Observable<string> {
    return new Observable<string>(observer => {
      setTimeout(() => {
        observer.next("Hello");
        observer.complete();
      });
    });
  }
}
