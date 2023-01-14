import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange } from '@angular/core';
import { EliteLogoAnimation } from '@shared/util-global';
import { interval, Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'global-elite-logo',
  templateUrl: './elite-logo.component.html',
})
export class EliteLogoComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public elementId: string | null = null;
  @Input() public showLogo = true;
  @Input() public showLogoText = true;
  @Input() public playingAnimation = false;
  @Input() public changeAnimation = false;
  @Input() public presetName = '';
  @Output() private animationFinished = new EventEmitter();
  public frameInterval = 1000;
  public durationOffset = 0;
  public animationMode = ''; // <-- ping-pong or one-shot
  public stepsPrimary: string[] = [];
  public stepsSecTop: string[] = [];
  public stepsSecBottom: string[] = [];
  public stepsElite1: string[] = [];
  public stepsElite2: string[] = [];
  public stepsElite3: string[] = [];
  public stepsElite4: string[] = [];
  public stepsElite5: string[] = [];
  public stepsSolution1: string[] = [];
  public stepsSolution2: string[] = [];
  public stepsSolution3: string[] = [];
  public stepsSolution4: string[] = [];
  public stepsSolution5: string[] = [];
  public stepsSolution6: string[] = [];
  public stepsSolution7: string[] = [];
  public stepsSolution8: string[] = [];
  public stepsSolution9: string[] = [];
  public staticClasses: string[] = [
    'fill-primary stroke-textA',
    'fill-textA stroke-textA',
    'fill-textA stroke-textA',
    'fill-primary stroke-textA',
    'fill-primary stroke-textA',
    'fill-primary stroke-textA',
    'fill-primary stroke-textA',
    'fill-primary stroke-textA',
    'fill-textA stroke-textA',
    'fill-textA stroke-textA',
    'fill-textA stroke-textA',
    'fill-textA stroke-textA',
    'fill-textA stroke-textA',
    'fill-textA stroke-textA',
    'fill-textA stroke-textA',
    'fill-textA stroke-textA',
    'fill-textA stroke-textA',
  ];
  public isPlaying = false;
  public animationFrame = 0;
  private steps = 2;
  private stopping = true;
  private endFrame = -1;
  private sub: Subscription = new Subscription();
  private animationLoaded = false;

  public ngOnInit(): void {
    this.tryToLoadAnimation();
  }

  private tryToLoadAnimation(): void {
    if (this.presetName !== '') {
      import('./' + this.presetName + '.json')
        .then((preset) => {
          const loadedAnimation: EliteLogoAnimation = JSON.parse(JSON.stringify(preset));
          this.frameInterval = loadedAnimation.frameInterval;
          this.durationOffset = loadedAnimation.durationOffset;
          this.animationMode = loadedAnimation.animationMode; // <-- ping-pong or one-shot
          this.stepsPrimary = loadedAnimation.stepsPrimary;
          this.stepsSecTop = loadedAnimation.stepsSecTop;
          this.stepsSecBottom = loadedAnimation.stepsSecBottom;
          this.stepsElite1 = loadedAnimation.stepsElite1;
          this.stepsElite2 = loadedAnimation.stepsElite2;
          this.stepsElite3 = loadedAnimation.stepsElite3;
          this.stepsElite4 = loadedAnimation.stepsElite4;
          this.stepsElite5 = loadedAnimation.stepsElite5;
          this.stepsSolution1 = loadedAnimation.stepsSolution1;
          this.stepsSolution2 = loadedAnimation.stepsSolution2;
          this.stepsSolution3 = loadedAnimation.stepsSolution3;
          this.stepsSolution4 = loadedAnimation.stepsSolution4;
          this.stepsSolution5 = loadedAnimation.stepsSolution5;
          this.stepsSolution6 = loadedAnimation.stepsSolution6;
          this.stepsSolution7 = loadedAnimation.stepsSolution7;
          this.stepsSolution8 = loadedAnimation.stepsSolution8;
          this.stepsSolution9 = loadedAnimation.stepsSolution9;
          this.staticClasses = loadedAnimation.staticClasses;
          this.calcSteps();
        })
        .catch(() => {
          this.presetName = '';
          this.animationLoaded = true;
        });
    } else {
      this.animationLoaded = true;
    }
  }

  private calcSteps(): void {
    this.steps = Math.max(
      this.stepsPrimary.length,
      this.stepsSecTop.length,
      this.stepsSecBottom.length,
      this.stepsElite1.length,
      this.stepsElite2.length,
      this.stepsElite3.length,
      this.stepsElite4.length,
      this.stepsElite5.length,
      this.stepsSolution1.length,
      this.stepsSolution2.length,
      this.stepsSolution3.length,
      this.stepsSolution4.length,
      this.stepsSolution5.length,
      this.stepsSolution6.length,
      this.stepsSolution7.length,
      this.stepsSolution8.length,
      this.stepsSolution9.length
    );
    if (this.steps < 2) {
      this.steps = 2;
    }
    this.animationLoaded = true;
  }

  async ngOnChanges(changes: { [property: string]: SimpleChange }) {
    while (!this.animationLoaded) {
      // console.log('WAIT');
      await new Promise((f) => setTimeout(f, 300));
    }
    const changeAnimation: SimpleChange = changes['changeAnimation'];
    if (changeAnimation) {
      // console.log('CHANGE ANIMATION ' + changeAnimation.currentValue);
      if (changeAnimation.currentValue === true) {
        this.onStopAnimation();
        this.tryToLoadAnimation();
      }
    }

    const changePlaying: SimpleChange = changes['playingAnimation'];
    if (changePlaying) {
      //console.log('CHANGE PLAYING ' + changePlaying.currentValue);
      if (changePlaying.currentValue === true && !this.isPlaying) {
        this.onStartAnimation();
      } else {
        if (this.animationMode === 'one-shot' && this.isPlaying) {
          return;
        }
        this.onStopAnimation();
      }
    }
  }
  public onStartAnimation(): void {
    // console.log('START ANIMATION');
    this.isPlaying = true;
    this.stopping = false;

    let animDir = 1;
    this.endFrame = this.steps - 1;

    this.sub = interval(this.frameInterval).subscribe(() => {
      this.animationFrame += animDir;
      if (this.animationMode === 'one-shot' && this.animationFrame >= this.endFrame) {
        this.stopping = true;
      } else if (animDir === 1 && this.animationFrame > this.endFrame) {
        if (this.animationMode === 'ping-pong') {
          animDir = -1;
          this.animationFrame -= 2;
        } else {
          this.animationFrame = 1;
        }
      } else if (this.animationMode === 'ping-pong' && animDir === -1 && this.animationFrame < 1) {
        animDir = 1;
        this.animationFrame = 2;
      }
      if (this.stopping) {
        this.sub.unsubscribe();
        this.isPlaying = false;
        this.playingAnimation = false;
        if (this.animationMode !== 'one-shot') {
          this.animationFrame = 0;
        } else {
          setTimeout(() => {
            this.animationFinished.emit();
            this.animationFrame = this.steps;
          }, this.frameInterval * this.durationOffset);
        }
      }
    });
  }

  public onStopAnimation(): void {
    // console.log('STOP');
    this.stopping = true;
    if (this.animationMode === 'one-shot' && !this.isPlaying) {
      this.animationFrame = 0;
    }
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
