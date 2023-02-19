import { Injectable } from '@angular/core';
import { Vector2 } from '../entities/vector2';

@Injectable({
  providedIn: 'root',
})
export class Vector2Service {
  public normalize(vector2: Vector2): Vector2 {
    const normalizedVector2: Vector2 = vector2;
    const m = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
    normalizedVector2.x /= m;
    normalizedVector2.y /= m;
    return normalizedVector2;
  }

  public distance(vector2A: Vector2, vector2B: Vector2): number {
    return Math.sqrt(
      (vector2A.x - vector2B.x) * (vector2A.x - vector2B.x) + (vector2A.y - vector2B.y) * (vector2A.y - vector2B.y)
    );
  }

  public sub(vector2A: Vector2, vector2B: Vector2): Vector2 {
    return {
      x: vector2A.x - vector2B.x,
      y: vector2A.y - vector2B.y,
    };
  }

  public multiply(vector2: Vector2, multi: number): Vector2 {
    return {
      x: vector2.x * multi,
      y: vector2.y * multi,
    };
  }
}
