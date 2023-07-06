import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SubmissionService {
  private notificationSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>("");
  public notification$: Observable<string> =
    this.notificationSubject.asObservable();

  constructor() {}

  showNotification(message: string) {
    this.notificationSubject.next(message);
  }
}
