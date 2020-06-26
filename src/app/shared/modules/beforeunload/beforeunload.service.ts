import { Inject, Injectable, Optional } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { filter, mapTo, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { BEFORE_UNLOAD_FN, BEFORE_UNLOAD_MESSAGE } from './beforeunload.token';

@Injectable({
  providedIn: 'root',
})
export class BeforeunloadService {
  leaveCheckFn: { [Key: string]: Function } = {};

  get leaveSubject() {
    return new Subject().pipe(
      switchMap((x) =>
        this.leaveCheck(this.message).pipe(
          filter((result) => !!result),
          mapTo(x)
        )
      )
    ) as Subject<any>;
  }

  constructor(
    @Optional() @Inject(BEFORE_UNLOAD_MESSAGE) private message: string,
    @Optional()
    @Inject(BEFORE_UNLOAD_FN)
    private alertFn: (message: string) => Observable<boolean>
  ) {}

  addLeaveCheck(fn: Function) {
    const nowKey = Object.keys(this.leaveCheckFn).length;
    this.leaveCheckFn[nowKey] = fn;
    return `${nowKey}`;
  }

  leaveCheck(message?: string) {
    console.log(this.leaveCheckFn);
    const checkResult = Object.keys(this.leaveCheckFn).some((key) => {
      const result = this.leaveCheckFn[key]();
      if (typeof result === 'string') {
        message = result;
      }
      return result;
    });

    if (checkResult) {
      return this.showConfirm(message);
    }
    return of(true);
  }

  showConfirm(message: string) {
    return this.alertFn ? this.alertFn(message) : of(confirm(message));
  }

  removeLeaveCheck(key: string) {
    delete this.leaveCheckFn[key];
  }

  listenChange(instance) {
    return of(null).pipe(this.listenChangeOperator(instance));
  }

  listenChangeOperator(instance) {
    return (obs) =>
      obs.pipe(
        switchMap(() => instance.formGroup.valueChanges),
        take(1),
        tap(() => (instance.hasChange = true)),
        takeUntil(instance._destroy$)
      );
  }
}
