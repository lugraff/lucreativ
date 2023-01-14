import { TestBed } from '@angular/core/testing';

import { INJECTION_TOKEN_SMALL_SCREEN_BREAKPOINT, IsMobileScreenService } from './is-mobile-screen.service';

describe('IsmobleService', () => {
  let service: IsMobileScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: INJECTION_TOKEN_SMALL_SCREEN_BREAKPOINT, useValue: 505 }],
    });
    service = TestBed.inject(IsMobileScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should convert breakpoints correctly', () => {
    expect(service.ConvertBreakpoint('sm')).toBe(640);
    expect(service.ConvertBreakpoint('md')).toBe(768);
    expect(service.ConvertBreakpoint('lg')).toBe(1024);
    expect(service.ConvertBreakpoint('xl')).toBe(1280);
    expect(service.ConvertBreakpoint('2xl')).toBe(1536);
  });
  it('should convert pixel input correctly', () => {
    expect(service.ConvertBreakpoint('500px')).toBe(500);
    expect(service.ConvertBreakpoint('1000px')).toBe(1000);
  });
  it('should have a value for isMobileScreen$ ', (done) => {
    expect(service.isMobileScreen$).toBeTruthy();
    service.isMobileScreen$.subscribe((value) => {
      expect(value).toBe(false);
      done();
    });
  });
  // the following test does not work! window size is still 1024
  // it('should have a value for isMobileScreen$ ', (done) => {
  //   window.innerWidth = 250;
  //   window.dispatchEvent(new Event('resize'));
  //   expect(service.isMobileScreen$).toBeTruthy();
  //   service.isMobileScreen$.subscribe((value) => {
  //     expect(value).toBe(true);
  //     done()
  //   });
  // });
});
