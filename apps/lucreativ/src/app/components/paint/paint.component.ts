import { AfterViewInit, Component, ElementRef, HostBinding, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent, Observable, switchMap, takeUntil } from 'rxjs';
import { ButtonListComponent, ListComponent, PopupComponent } from '@shared/ui-global';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lucreativ-paint',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonListComponent, ListComponent, PopupComponent],
  templateUrl: './paint.component.html',
})
export class PaintComponent implements AfterViewInit {
  @HostBinding('class') public class = 'bg-bgD animate-spin w-screen h-screen';
  @ViewChild('layerContainer') layerContainer!: ElementRef;
  private actualCanvas: HTMLCanvasElement | undefined = undefined;
  private ctx: CanvasRenderingContext2D | undefined = undefined;
  public layerlist: string[] = ['Image'];
  public actualID = '';
  public lineWidth = 2;
  public lineColor = '#ffffff';
  public newNumber = 0;
  public notAvailableText = 'Image';
  public showLayerPopup = true;

  constructor(private renderer: Renderer2, private elRef: ElementRef) {}
  ngAfterViewInit(): void {
    this.createNewLayer();
  }

  onNewLayer() {
    this.createNewLayer();
  }
  private createNewLayer(): void {
    this.actualCanvas = this.renderer.createElement('canvas');
    if (this.actualCanvas) {
      this.actualCanvas.id = 'Layer_' + ++this.newNumber;
      this.actualID = this.actualCanvas.id;
      this.actualCanvas.width = innerWidth;
      this.actualCanvas.height = innerHeight;
      this.actualCanvas.style.position = 'fixed';
      this.actualCanvas.style.backgroundColor = 'transparent';
      this.actualCanvas.style.border = '10px';
      this.actualCanvas.style.borderWidth = '10';
      this.actualCanvas.style.borderColor = '#ffffff';
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

  onDeleteLayer(index: number) {
    document.getElementById(this.layerlist[index])?.remove();
    this.layerlist.splice(index, 1);
    this.actualCanvas = undefined;
    this.actualID = 'Image';
  }

  onSaveImage() {
    //
  }

  private pen(): void {
    let startX = 0;
    let startY = 0;
    const rect = this.actualCanvas?.getBoundingClientRect();
    console.log(rect);
    if (this.actualCanvas !== undefined && rect !== undefined) {
      fromEvent(this.actualCanvas, 'pointerdown')
        .pipe(
          switchMap((e: MouseEvent | any) => {
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;
            if (this.actualCanvas !== undefined) {
              return fromEvent(this.actualCanvas, 'pointermove').pipe(
                takeUntil(fromEvent(this.actualCanvas, 'pointerup'))
                // takeUntil(fromEvent(this.actualCanvas, 'mouseleave'))
              );
            }
            return new Observable();
          })
        )
        .subscribe((event: any) => {
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
