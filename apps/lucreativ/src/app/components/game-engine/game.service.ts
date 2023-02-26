import { Action, Gamestatus, Node, StaticNode } from './entities';
import { GameServiceAbstract } from './game-abstract.service';

export class GameService extends GameServiceAbstract {
  //-----------------------------------STATIC-------------------------------
  private startScreen: StaticNode = {
    sprite: {
      img: new Image(),
      imgPath: 'assets/game/CodeRannerLogo.png',
      tiles: { x: 1, y: 1 },
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
    },
    frame: 0,
    position: { x: 32, y: 200 },
  };
  playerGravity = 1;
  playerIsOnFloor = false;

  private bug: Node = {
    sprite: {
      img: new Image(),
      imgPath: 'assets/game/bug-sheet.png',
      tiles: { x: 4, y: 4 },
    },
    frame: 0,
    position: { x: 200, y: 100 },
  };

  private cityA: Node = {
    script: 'city',
    sprite: {
      img: new Image(),
      imgPath: 'assets/game/city.png',
      tiles: { x: 1, y: 1 },
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
    },
    frame: 0,
    position: { x: 512, y: 130 },
  };
  public override nodes: Node[] = [this.cityA, this.cityB, this.player];

  constructor() {
    super();
    for (const tex of this.staticNodes) {
      tex.sprite.img.src = tex.sprite.imgPath;
      tex.sprite.tileSize = {
        x: tex.sprite.img.width / tex.sprite.tiles.x,
        y: tex.sprite.img.height / tex.sprite.tiles.y,
      };
    }
    for (const tex of this.nodes) {
      tex.sprite.img.src = tex.sprite.imgPath;
      tex.sprite.tileSize = {
        x: tex.sprite.img.width / tex.sprite.tiles.x,
        y: tex.sprite.img.height / tex.sprite.tiles.y,
      };
    }
  }

  public runScript(
    gamestatus: Gamestatus,
    name: string,
    node: Node,
    actionA: Action,
    actionB: Action,
    actionLeft: Action,
    actionRight: Action,
    actionUp: Action,
    actionDown: Action
  ): void {
    if (name === 'player') {
      this.playerScript(gamestatus, node, actionA, actionB, actionLeft, actionRight, actionUp, actionDown);
    } else if (name === 'city') {
      this.cityScript(gamestatus, node, actionA, actionB, actionLeft, actionRight, actionUp, actionDown);
    }
  }

  private playerScript(
    gamestatus: Gamestatus,
    node: Node,
    actionA: Action,
    actionB: Action,
    actionLeft: Action,
    actionRight: Action,
    actionUp: Action,
    actionDown: Action
  ): void {
    // console.log(node.position.y);
    // console.log(gamestatus.windowSize.y);
    let nodeSize = node.sprite.tileSize;
    if (nodeSize === undefined) {
      nodeSize = { x: 0, y: 0 }; //32 fallback?
    }
    if (node.position.y < 240 - nodeSize.y) {
      if (this.playerGravity < 6) {
        this.playerGravity++;
      }
    } else {
      this.playerGravity = 0;
      this.playerIsOnFloor = true;
    }
    if (actionA.isPressed && this.playerIsOnFloor) {
      this.playerIsOnFloor = false;
      this.playerGravity = -10;
    }
    node.position.y += this.playerGravity;

    if (actionRight.isPressed && node.position.x < 320 - nodeSize.x) {
      node.position.x += 1;
    }
    if (actionLeft.isPressed && node.position.x > 0) {
      node.position.x -= 1;
    }

    if (actionUp.isPressed && node.position.y > 100) {
      node.position.y -= 1;
    }
    if (actionDown.isPressed && node.position.y < 240 - nodeSize.y) {
      node.position.y += 1;
    }
  }

  private cityScript(
    gamestatus: Gamestatus,
    node: Node,
    actionA: Action,
    actionB: Action,
    actionLeft: Action,
    actionRight: Action,
    actionUp: Action,
    actionDown: Action
  ): void {
    // console.log(node.position.y);
    // console.log(gamestatus.windowSize.y);
    let nodeSize = node.sprite.tileSize;
    if (nodeSize === undefined) {
      nodeSize = { x: 0, y: 0 }; //32 fallback?
    }
    if (node.position.x < -nodeSize.x) {
      node.position.x = nodeSize.x;
    }
    node.position.x--;
  }
}
