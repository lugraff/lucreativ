import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Vector2 } from '@shared/util-global';
import { IsMobileScreenService } from '@shared/util-screen';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'lucreativ-dotknot',
  templateUrl: './dotknot.component.html',
})
export class DotknotComponent {
  private winSize: Vector2 = { x: 1920, y: 1080 };
  public windowScale = 100;

  constructor(screenService: IsMobileScreenService) {
    screenService.windowWidth$.subscribe((value) => {
      this.winSize.x = value;
      this.calcScale();
    });
    screenService.windowHeight$.subscribe((value) => {
      this.winSize.y = value;
      this.calcScale();
    });
  }

  private calcScale(): void {
    //TIMEOUT
    const calcedY = (100 / 720) * this.winSize.y;
    const calcedX = (100 / 1280) * this.winSize.x;
    if (calcedY > calcedX) {
      this.windowScale = calcedX;
    } else {
      this.windowScale = calcedY;
    }
  }
}
