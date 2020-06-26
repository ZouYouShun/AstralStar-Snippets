import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export function runAfterTimeout(milliseconds: number = 0, observable = false) {
  return function (target, key, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
      if (observable) {
        return timer(milliseconds).pipe(
          switchMap(() => originalMethod.apply(this, args))
        );
      } else {
        setTimeout(() => {
          originalMethod.apply(this, args);
        }, milliseconds);
      }
    };
    return descriptor;
  };
}
