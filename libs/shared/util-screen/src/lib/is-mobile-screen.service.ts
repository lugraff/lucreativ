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

export const INJECTION_TOKEN_SMALL_SCREEN_BREAKPOINT = 'SmallScreenBreakpoint';

@Injectable({
  providedIn: 'root',
})
export class IsMobileScreenService {
  private readonly regex_mobile = new RegExp(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/, 'i');
  public readonly isMobile = this.regex_mobile.test(window.navigator.userAgent);
  private isMobileScreen = new BehaviorSubject<boolean>(false);
  public isMobileScreen$ = this.isMobileScreen.asObservable();

  private _breakPoint = 768;

  private windowWidth = new BehaviorSubject<number>(0);
  public windowWidth$ = this.windowWidth.asObservable();
  private windowHeight = new BehaviorSubject<number>(0);
  public windowHeight$ = this.windowHeight.asObservable();
  private landscape = new BehaviorSubject<boolean>(true);
  public landscape$ = this.landscape.asObservable();

  private calcTimeout = setTimeout(() => {
    console.log;
  }, 100);

  constructor(@Optional() @Inject(INJECTION_TOKEN_SMALL_SCREEN_BREAKPOINT) breakpoint: string) {
    this._breakPoint = this.ConvertBreakpoint(breakpoint ?? 'sm');
    this.CheckWindow();
    window.addEventListener('resize', () => {
      this.CheckWindow();
    });
  }

  public CheckWindow() {
    clearTimeout(this.calcTimeout);
    this.calcTimeout = setTimeout(() => {
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      this.windowHeight.next(vh);
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      this.windowWidth.next(vw);
      // everything is hooked to the Tailwind md: param which is 768.
      const isMobile = vw < this._breakPoint;
      if (isMobile !== this.isMobileScreen.value) {
        this.isMobileScreen.next(isMobile);
      }
      if (vh > vw) {
        this.landscape.next(true);
      } else {
        this.landscape.next(false);
      }
    }, 100);
  }

  ConvertBreakpoint(breakpoint: string): number {
    if (typeof breakpoint !== 'string') {
      return 768;
    }
    if (breakpoint === 'sm') {
      return 640;
    } else if (breakpoint === 'md') {
      return 768;
    } else if (breakpoint === 'lg') {
      return 1024;
    } else if (breakpoint === 'xl') {
      return 1280;
    } else if (breakpoint === '2xl') {
      return 1536;
    } else if (breakpoint.endsWith('px')) {
      return parseInt(breakpoint.slice(0, -2).trim(), 10);
    }
    return this._breakPoint;
  }
}
