import { Action, Gamestatus, Node, StaticNode } from './entities';
import { GameServiceAbstract } from './game-abstract.service';

export class GameService extends GameServiceAbstract {
  //-----------------------------------STATIC-------------------------------
  private startScreen: StaticNode = {
    sprite: {
      img: new Image(),
      imgPath: 'assets/game/CodeRannerLogo.png',
      tileSize: { x: 640, y: 480 },
      tiles: { x: 1, y: 1 },
    },
    position: { x: 80, y: 0 },
  };
  public override staticNodes: StaticNode[] = [this.startScreen];
  //-----------------------------------ANIMATED-------------------------------
  private player: Node = {
    script: 'player',
    sprite: {
      img: new Image(),
      imgPath: 'assets/game/runner-sheet.png',
      tileSize: { x: 32, y: 32 },
      tiles: { x: 8, y: 3 },
    },
    frame: 0,
    position: { x: 80, y: 200 },
  };
  playerGravity = 1;
  playerIsOnFloor = false;

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
  public override nodes: Node[] = [this.player, this.bug];

  constructor() {
    super();
    for (const tex of this.staticNodes) {
      tex.sprite.img.src = tex.sprite.imgPath;
    }
    for (const tex of this.nodes) {
      tex.sprite.img.src = tex.sprite.imgPath;
    }
  }

  public runScript(gamestatus: Gamestatus, name: string, node: Node, actionA: Action): void {
    if (name === 'player') {
      this.playerScript(gamestatus, node, actionA);
    }
  }

  private playerScript(gamestatus: Gamestatus, node: Node, actionA: Action): void {
    // console.log(node.position.y);
    // console.log(gamestatus.windowSize.y);
    if (node.position.y < gamestatus.windowSize.y - 700) {
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

    if (node.position.x > gamestatus.windowSize.x / 3) {
      node.position.x = -32;
    }
    node.position.x += 1.2;
  }
}
