import { Vector2 } from '@shared/util-global';
import { BehaviorSubject, Subject, take } from 'rxjs';
import { Action, Actions, Gamestatus, Node, StaticNode } from './entities';
import { GameServiceAbstract } from './game-abstract.service';

export class GameService extends GameServiceAbstract {
  public stopGame = new BehaviorSubject(false);
  //-----------------------------------STATIC-------------------------------
  private startScreen: StaticNode = {
    sprite: {
      img: new Image(),
      imgPath: 'assets/game/CodeRannerLogo.png',
      tiles: { x: 1, y: 1 },
      actualAnimation: 0,
    },
    position: { x: 0, y: 0 },
  };
  public override staticNodes: StaticNode[] = [this.startScreen];
  //-----------------------------------ANIMATED-------------------------------
  private player: Node = {
    script: 'player',
    sprite: {
      img: new Image(),
      imgPath: 'assets/game/runner-sheet.png',
      tiles: { x: 8, y: 3 },
      animations: [
        { tile: { x: 0, y: 0 }, length: 4 },
        { tile: { x: 0, y: 1 }, length: 8 },
        { tile: { x: 0, y: 2 }, length: 4 },
      ],
      actualAnimation: 0,
    },
    frame: 0,
    position: { x: 32, y: 200 },
  };
  playerGravity = 1;
  playerIsOnFloor = false;

  private bugA: Node = {
    script: 'bug',
    sprite: {
      img: new Image(),
      imgPath: 'assets/game/bug-sheet.png',
      tiles: { x: 8, y: 4 },
      animations: [{ tile: { x: 0, y: 3 }, length: 4 }],
      actualAnimation: 0,
    },
    frame: 0,
    position: { x: Math.random() * 500 + 320, y: 200 },
  };
  private bugB: Node = {
    script: 'bug',
    sprite: {
      img: new Image(),
      imgPath: 'assets/game/bug-sheet.png',
      tiles: { x: 8, y: 4 },
      animations: [{ tile: { x: 0, y: 3 }, length: 4 }],
      actualAnimation: 0,
    },
    frame: 0,
    position: { x: Math.random() * 500 + 320, y: 200 },
  };
  private bugC: Node = {
    script: 'bug',
    sprite: {
      img: new Image(),
      imgPath: 'assets/game/bug-sheet.png',
      tiles: { x: 8, y: 4 },
      animations: [{ tile: { x: 0, y: 3 }, length: 4 }],
      actualAnimation: 0,
    },
    frame: 0,
    position: { x: Math.random() * 500 + 320, y: 200 },
  };

  private cityA: Node = {
    script: 'city',
    sprite: {
      img: new Image(),
      imgPath: 'assets/game/city.png',
      tiles: { x: 1, y: 1 },
      actualAnimation: 0,
    },
    frame: 0,
    position: { x: 0, y: 100 },
  };
  private cityB: Node = {
    script: 'city',
    sprite: {
      img: new Image(),
      imgPath: 'assets/game/city.png',
      tiles: { x: 1, y: 1 },
      actualAnimation: 0,
    },
    frame: 0,
    position: { x: 512, y: 100 },
  };
  public override nodes: Node[] = [this.cityA, this.cityB, this.player, this.bugA, this.bugB, this.bugC];

  private loadingFinished = new Subject<boolean>();
  public loadingFinished$ = this.loadingFinished.asObservable();
  constructor() {
    super();
    this.loadImages();
  }

  private loadImages(): void {
    const steps = new BehaviorSubject(this.staticNodes.length + this.nodes.length);
    steps.pipe(take(this.staticNodes.length + this.nodes.length)).subscribe((value) => {
      if (value === 1) {
        this.loadingFinished.next(true);
      }
    });
    for (const tex of this.staticNodes) {
      tex.sprite.img.src = tex.sprite.imgPath;
      tex.sprite.img.onload = function () {
        tex.sprite.tileSize = {
          x: tex.sprite.img.width / tex.sprite.tiles.x,
          y: tex.sprite.img.height / tex.sprite.tiles.y,
        };
        steps.next(steps.value - 1);
      };
    }
    for (const tex of this.nodes) {
      tex.sprite.img.src = tex.sprite.imgPath;
      tex.sprite.img.onload = function () {
        tex.sprite.tileSize = {
          x: tex.sprite.img.width / tex.sprite.tiles.x,
          y: tex.sprite.img.height / tex.sprite.tiles.y,
        };
        steps.next(steps.value - 1);
      };
    }
  }

  public runNode(ctx: CanvasRenderingContext2D, gamestatus: Gamestatus, node: Node, actions: Actions): void {
    if (node.script === 'player') {
      this.playerScript(
        ctx,
        gamestatus,
        node,
        actions.actionA,
        actions.actionB,
        actions.actionLeft,
        actions.actionRight,
        actions.actionUp,
        actions.actionDown
      );
    } else if (node.script === 'city') {
      this.cityScript(ctx, gamestatus, node);
    } else if (node.script === 'bug') {
      this.bugScript(ctx, gamestatus, node);
    }
  }

  private playerScript(
    ctx: CanvasRenderingContext2D,
    gamestatus: Gamestatus,
    node: Node,
    actionA: Action,
    actionB: Action,
    actionLeft: Action,
    actionRight: Action,
    actionUp: Action,
    actionDown: Action
  ): void {
    let nodeSize = node.sprite.tileSize;
    if (nodeSize === undefined) {
      nodeSize = { x: 32, y: 32 };
    }
    if (gamestatus.nextFrame) {
      node.frame++;
    }

    if (node.sprite.animations) {
      if (node.frame > node.sprite.animations[node.sprite.actualAnimation].length - 1) {
        node.frame = node.sprite.animations[node.sprite.actualAnimation].tile.x;
      }
    } else if (node.frame >= node.sprite.tiles.x) {
      node.frame = 0;
    }

    const anim: Vector2 = { x: 0, y: 0 };
    if (node.sprite.animations) {
      anim.x = node.sprite.animations[node.sprite.actualAnimation].tile.x * nodeSize.x + node.frame * nodeSize.x;
      anim.y = node.sprite.animations[node.sprite.actualAnimation].tile.y * nodeSize.y;
    }

    // console.log(gamestatus.windowSize.y);
    if (node.position.y < 240 - nodeSize.y) {
      if (this.playerGravity < 10) {
        this.playerGravity += 0.25;
      }
    } else {
      this.playerGravity = 0;
      this.player.position.y = 240 - nodeSize.y;
      this.playerIsOnFloor = true;
    }
    if (actionA.isPressed && this.playerIsOnFloor) {
      this.playerIsOnFloor = false;
      this.playerGravity = -7;
      node.sprite.actualAnimation = 2;
    }
    node.position.y += this.playerGravity;

    if (actionRight.isPressed && node.position.x < 320 - nodeSize.x) {
      node.position.x += 1;
    }
    if (actionLeft.isPressed && node.position.x > 0) {
      node.position.x -= 1;
      node.sprite.actualAnimation = 0;
    } else {
      if (this.playerIsOnFloor) {
        node.sprite.actualAnimation = 1;
      }
    }

    if (actionUp.isPressed && node.position.y > 100) {
      node.position.y -= 1;
    }
    if (actionDown.isPressed && node.position.y < 240 - nodeSize.y) {
      node.position.y += 1;
    }

    ctx.drawImage(
      node.sprite.img,
      anim.x,
      anim.y,
      node.sprite.img.width / node.sprite.tiles.x,
      node.sprite.img.height / node.sprite.tiles.y,
      node.position.x,
      node.position.y,
      node.sprite.img.width / node.sprite.tiles.x,
      node.sprite.img.height / node.sprite.tiles.y
    );
  }

  private cityScript(ctx: CanvasRenderingContext2D, gamestatus: Gamestatus, node: Node): void {
    // console.log(node.position.y);
    // console.log(gamestatus.windowSize.y);
    let nodeSize = node.sprite.tileSize;
    if (nodeSize === undefined) {
      nodeSize = { x: 512, y: 140 };
    }
    if (node.position.x < -nodeSize.x) {
      node.position.x = nodeSize.x;
    }
    node.position.x--;

    ctx.drawImage(
      node.sprite.img,
      0,
      0,
      node.sprite.img.width / node.sprite.tiles.x,
      node.sprite.img.height / node.sprite.tiles.y,
      node.position.x,
      node.position.y,
      node.sprite.img.width / node.sprite.tiles.x,
      node.sprite.img.height / node.sprite.tiles.y
    );
  }

  private bugScript(ctx: CanvasRenderingContext2D, gamestatus: Gamestatus, node: Node): void {
    // console.log(node.position.y);
    // console.log(gamestatus.windowSize.y);
    let nodeSize = node.sprite.tileSize;
    if (nodeSize === undefined) {
      nodeSize = { x: 50, y: 50 };
    }

    if (gamestatus.nextFrame) {
      node.frame++;
    }

    if (node.sprite.animations) {
      if (node.frame > node.sprite.animations[node.sprite.actualAnimation].length - 1) {
        node.frame = node.sprite.animations[node.sprite.actualAnimation].tile.x;
      }
    } else if (node.frame >= node.sprite.tiles.x) {
      node.frame = 0;
    }

    const anim: Vector2 = { x: 0, y: 0 };
    if (node.sprite.animations) {
      anim.x = node.sprite.animations[node.sprite.actualAnimation].tile.x * nodeSize.x + node.frame * nodeSize.x;
      anim.y = node.sprite.animations[node.sprite.actualAnimation].tile.y * nodeSize.y;
    }

    node.position.x -= 1.25; //TODO Speed

    if (node.position.x < -nodeSize.x) {
      node.position.x = 320 + Math.random() * 300;
    }

    if (this.distance(node.position, this.player.position) < 10) {
      this.stopGame.next(true);
      setTimeout(() => {
        this.bugA.position.x = Math.random() * 500 + 320;
        this.bugB.position.x = Math.random() * 500 + 320;
        this.bugC.position.x = Math.random() * 500 + 320;
      });
    }

    ctx.drawImage(
      node.sprite.img,
      anim.x,
      anim.y,
      node.sprite.img.width / node.sprite.tiles.x,
      node.sprite.img.height / node.sprite.tiles.y,
      node.position.x,
      node.position.y,
      node.sprite.img.width / node.sprite.tiles.x,
      node.sprite.img.height / node.sprite.tiles.y
    );
  }

  public distance(vector2A: Vector2, vector2B: Vector2): number {
    return Math.sqrt(
      (vector2A.x - vector2B.x) * (vector2A.x - vector2B.x) + (vector2A.y - vector2B.y) * (vector2A.y - vector2B.y)
    );
  }
}
