import { Subject, Observable } from "rxjs";

export class sidenaveService {
  private subject = new Subject<any>();

  constructor() {}

  sidenavOpen() {
    this.subject.next(true);
  }

  sidenavCloth() {
    this.subject.next(false);
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
