import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

/// tailwind break points
// sm=	640px
// md=	768px
// lg=	1024px
// xl=	1280px
// 2xl= 1536px
// 500px = 500px
// else 768px

export const INJECTION_TOKEN_IS_PRODUCTION = 'IS_PRODUCTION';

@Injectable({
  providedIn: 'root',
})
export class IsProductionService {
  public isProduction = true;

  constructor(@Inject(INJECTION_TOKEN_IS_PRODUCTION) isProduction: boolean) {
    this.isProduction = isProduction ?? true;
  }
}
