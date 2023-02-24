import { Action, Gamestatus, Node, StaticNode } from './entities';

export abstract class GameServiceAbstract {
  public staticNodes: StaticNode[] = [];
  public nodes: Node[] = [];

  public abstract runScript(gamestatus: Gamestatus, name: string, node: Node, actionA: Action): void;
}
