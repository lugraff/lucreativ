import { Actions, Gamestatus, Node, StaticNode } from './entities';

export abstract class GameServiceAbstract {
  public staticNodes: StaticNode[] = [];
  public nodes: Node[] = [];

  public abstract runNode(ctx: CanvasRenderingContext2D, gamestatus: Gamestatus, node: Node, actions: Actions): void;
}
