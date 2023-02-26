import { Vector2 } from '@shared/util-global';

export interface Gamestatus {
  fps: number;
  tick: number;
  nextFrame: boolean;
  windowSize: Vector2;
}

export interface Action {
  isPressed: boolean;
}
export interface Actions {
  actionA: Action;
  actionB: Action;
  actionLeft: Action;
  actionUp: Action;
  actionDown: Action;
  actionRight: Action;
}

export interface Animation {
  tile: Vector2;
  length: number;
}

export interface Spritesheet {
  img: HTMLImageElement;
  imgPath: string;
  tiles: Vector2;
  tileSize?: Vector2;
  animations?: Animation[];
  actualAnimation: number;
}

export interface StaticNode {
  sprite: Spritesheet;
  position: Vector2;
}

export interface Node {
  script?: string;
  sprite: Spritesheet;
  frame: number;
  position: Vector2;
}
