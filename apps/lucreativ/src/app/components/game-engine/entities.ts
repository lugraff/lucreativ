import { Vector2 } from '@shared/util-global';

export interface Gamestatus {
  fps: number;
  tick: number;
  windowSize: Vector2;
}

export interface Action {
  isPressed: boolean;
}

export interface Spritesheet {
  img: HTMLImageElement;
  imgPath: string;
  tileSize: Vector2;
  tiles: Vector2;
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
