import {
  AfterViewInit,
  Directive,
  HostListener,
  Input,
  OnDestroy,
} from '@angular/core';

import { BeforeunloadService } from './beforeunload.service';
import { tap } from 'rxjs/operators';

@Directive({
  selector: '[beforeunload]',
})
export class BeforeunloadDirective implements AfterViewInit, OnDestroy {
  @Input('beforeunload') event: Function;
  @Input('exit') exitEvent: Function;

  private eventId: string;

  constructor(private service: BeforeunloadService) {}

  ngAfterViewInit(): void {
    this.eventId = this.service.addLeaveCheck(this.event);
  }

  @HostListener('window:beforeunload', ['$event'])
  public doSomething($event) {
    const result = this.event();
    if (result) {
      // only electron use that, because that can be trigger confirm
      setTimeout(() => {
        this.service
          .showConfirm(result)
          .pipe(
            tap((state) => {
              if (state && this.exitEvent) {
                this.exitEvent();
              }
            })
          )
          .subscribe();
      }, 0);
      $event.returnValue = true;
    }
  }

  ngOnDestroy(): void {
    console.log('!!!!!!d');
    this.service.removeLeaveCheck(this.eventId);
  }
}
