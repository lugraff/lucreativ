import { Vector2 } from '@shared/util-global';

export interface Gamestatus {
  fps: number;
  tick: number;
  windowSize: Vector2;
}

export interface Action {
  isPressed: boolean;
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
}

export interface StaticNode {
  sprite: Spritesheet;
  position: Vector2;
  groups?: string[];
}

export interface Node {
  script?: string;
  sprite: Spritesheet;
  frame: number;
  position: Vector2;
  groups?: string[];
}
