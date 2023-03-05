import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent, Observable, switchMap, takeUntil } from 'rxjs';
import { ButtonListComponent, IconComponent, ListComponent, PopupComponent } from '@shared/ui-global';
import { FormsModule } from '@angular/forms';
import { IsMobileScreenService } from '@shared/util-screen';

@Component({
  selector: 'lucreativ-paint',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonListComponent, ListComponent, PopupComponent, IconComponent],
  templateUrl: './paint.component.html',
})
export class PaintComponent {
  @ViewChild('layerContainer') layerContainer!: ElementRef;
  private actualCanvas: HTMLCanvasElement | undefined = undefined;
  private ctx: CanvasRenderingContext2D | undefined = undefined;
  public layerlist: string[] = ['Image'];
  public actualID = '';
  public lineWidth = 2;
  public lineColor = '#ffffff';
  public newNumber = 0;
  public notAvailableText = 'Image';
  public isMobile = false;

  constructor(private renderer: Renderer2, private machineInfo: IsMobileScreenService) {
    this.isMobile = machineInfo.isMobile;
  }

  onNewLayer() {
    this.createNewLayer();
  }
  private createNewLayer(): void {
    this.actualCanvas = this.renderer.createElement('canvas');
    if (this.actualCanvas) {
      this.actualCanvas.id = 'Layer_' + ++this.newNumber;
      this.actualID = this.actualCanvas.id;
      this.actualCanvas.width = this.actualCanvas.parentElement?.clientWidth ?? innerWidth;
      this.actualCanvas.height = this.actualCanvas.parentElement?.clientHeight ?? innerHeight;
      this.actualCanvas.style.backgroundColor = 'transparent';
      this.actualCanvas.style.cursor = 'crosshair';
      this.ctx = this.actualCanvas.getContext('2d') as CanvasRenderingContext2D;
      this.layerContainer.nativeElement.appendChild(this.actualCanvas);
      this.layerlist.push(this.actualCanvas.id);
      this.pen();
    }
  }

  onLayerSelect(layerID: string) {
    if (layerID !== this.notAvailableText) {
      const canvas = document.getElementById(layerID);
      if (canvas) {
        if (this.actualCanvas) {
          this.actualCanvas.style.zIndex = '0';
        }
        canvas.style.zIndex = '10';
        this.actualCanvas = canvas as HTMLCanvasElement;
        this.ctx = this.actualCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.actualID = layerID;
      }
    } else {
      if (this.actualCanvas) {
        this.actualCanvas = undefined;
        this.actualID = 'Image';
      }
    }
  }

  public onDeleteLayer(index: number): void {
    document.getElementById(this.layerlist[index])?.remove();
    this.layerlist.splice(index, 1);
    this.actualCanvas = undefined;
    this.actualID = 'Image';
  }

  public onSaveImage(): void {
    //
  }

  private pen(): void {
    let startX = 0;
    let startY = 0;
    const rect = this.actualCanvas?.getBoundingClientRect();
    if (this.actualCanvas !== undefined && rect !== undefined) {
      if (this.machineInfo.isMobile) {
        fromEvent<TouchEvent>(this.actualCanvas, 'touchstart')
          .pipe(
            switchMap((e: TouchEvent) => {
              startX = e.changedTouches[0].clientX - rect.left;
              startY = e.changedTouches[0].clientY - rect.top;
              if (this.actualCanvas !== undefined) {
                return fromEvent<TouchEvent>(this.actualCanvas, 'touchmove').pipe(
                  takeUntil(fromEvent<TouchEvent>(this.actualCanvas, 'touchend'))
                  // takeUntil(fromEvent(this.actualCanvas, 'mouseleave'))
                );
              }
              return new Observable<TouchEvent>();
            })
          )
          .subscribe((event: TouchEvent) => {
            const x = event.changedTouches[0].clientX - rect.left;
            const y = event.changedTouches[0].clientY - rect.top;
            if (this.ctx !== undefined && this.actualCanvas !== undefined) {
              this.ctx.strokeStyle = this.lineColor;
              this.ctx.lineWidth = this.lineWidth;
              this.ctx.lineCap = 'round';
              this.ctx.beginPath();
              // this.ctx.shadowBlur = 4;
              // this.ctx.shadowOffsetX = 6;
              // this.ctx.shadowColor = 'black';
              this.ctx.moveTo(startX, startY);
              this.ctx.lineTo(x, y);
              this.ctx.closePath();
              this.ctx.stroke();
              startX = x;
              startY = y;
            }
          });
      } else {
        fromEvent<MouseEvent>(this.actualCanvas, 'mousedown')
          .pipe(
            switchMap((e: MouseEvent) => {
              startX = e.clientX - rect.left;
              startY = e.clientY - rect.top;
              if (this.actualCanvas !== undefined) {
                return fromEvent<MouseEvent>(this.actualCanvas, 'mousemove').pipe(
                  takeUntil(fromEvent<MouseEvent>(this.actualCanvas, 'mouseup'))
                  // takeUntil(fromEvent(this.actualCanvas, 'mouseleave'))
                );
              }
              return new Observable<MouseEvent>();
            })
          )
          .subscribe((event: MouseEvent) => {
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            if (this.ctx !== undefined && this.actualCanvas !== undefined) {
              this.ctx.strokeStyle = this.lineColor;
              this.ctx.lineWidth = this.lineWidth;
              this.ctx.lineCap = 'round';
              this.ctx.beginPath();
              // this.ctx.shadowBlur = 4;
              // this.ctx.shadowOffsetX = 6;
              // this.ctx.shadowColor = 'black';
              this.ctx.moveTo(startX, startY);
              this.ctx.lineTo(x, y);
              this.ctx.closePath();
              this.ctx.stroke();
              startX = x;
              startY = y;
            }
          });
      }
    }
  }

  rectangleDrawing() {
    // first coordinates when clicked
    let startX = 0;
    let startY = 0;

    const rect = this.actualCanvas?.getBoundingClientRect();
    if (this.actualCanvas !== undefined && rect !== undefined) {
      fromEvent(this.actualCanvas, 'mousedown')
        .pipe(
          switchMap((e: any) => {
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;
            if (this.actualCanvas !== undefined) {
              return fromEvent(this.actualCanvas, 'mousemove').pipe(
                takeUntil(fromEvent(this.actualCanvas, 'mouseup')),
                takeUntil(fromEvent(this.actualCanvas, 'mouseleave'))
              );
            }
            return new Observable();
          })
        )
        .subscribe((event: any) => {
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          const width = x - startX;
          const height = y - startY;

          // this.setCanvasProperties(10, 'square', 'rgba(255,158,43,0.6)');
          if (this.ctx !== undefined && this.actualCanvas !== undefined) {
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(x, y);
            this.ctx.closePath();
            this.ctx.stroke();
            startX = x;
            startY = y;
            // if I comment this line, the rectangles will stay, but they
            // won't be clear, making multiples rectangles inside the
            // main rectangle
            // this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

            // this.ctx.strokeRect(startX, startY, width, height);
            // this.ctx.strokeRect(x,y,1,1);
          }
        });
    }
  }
  // setCanvasProperties(lineWidth: number, lineCap: string, strokeStyle: string) {
  //   this.cx = this.canvas.getContext('2d');
  //   this.cx.lineWidth = lineWidth;
  //   this.cx.lineCap = lineCap;
  //   this.cx.strokeStyle = strokeStyle;
  // }
  // if (canvas) {
  //   console.log(ctx);
  //   if (ctx) {
  //     ctx.lineWidth = 1;
  //     // ctx.strokeStyle = 'white';
  //     // ctx.strokeRect(10, 10, 100, 100);

  //     // ctx.fillStyle = 'green';
  //     // ctx.fillRect(10, 10, 100, 100);

  //     // Roof
  //     // ctx.beginPath();
  //     // ctx.moveTo(50, 140);
  //     // ctx.lineTo(150, 60);
  //     // ctx.lineTo(250, 140);
  //     // ctx.closePath();
  //     ctx.strokeStyle = 'red';
  //     ctx.beginPath();
  //     // ctx.roundRect(10, 20, 150, 100, undefined);
  //     ctx.stroke();
  //   }
  // }
}
