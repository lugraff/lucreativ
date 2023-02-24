import { Injectable } from '@angular/core';
import { Node } from './entities';

@Injectable({
  providedIn: 'root',
})
export class LevelsService {
  private startScreen: Node = {
    sprite: {
      img: new Image(),
      imgPath: 'assets/game/CodeRannerLogo.png',
      tileSize: { x: 640, y: 480 },
      tiles: { x: 1, y: 1 },
    },
    frame: 0,
    position: { x: 80, y: 0 },
  };
  private player: Node = {
    sprite: {
      img: new Image(),
      imgPath: 'assets/game/runner-sheet.png',
      tileSize: { x: 32, y: 32 },
      tiles: { x: 8, y: 3 },
    },
    frame: 0,
    position: { x: 80, y: 200 },
  };
  private bug: Node = {
    sprite: {
      img: new Image(),
      imgPath: 'assets/game/bug-sheet.png',
      tileSize: { x: 50, y: 50 },
      tiles: { x: 4, y: 4 },
    },
    frame: 0,
    position: { x: 380, y: 195 },
  };
  public staticNodes: Node[] = [this.startScreen];
  public nodes: Node[] = [this.player, this.bug];
}
