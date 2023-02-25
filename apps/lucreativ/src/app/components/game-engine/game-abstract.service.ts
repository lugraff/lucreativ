import { Action, Gamestatus, Node, StaticNode } from './entities';

export abstract class GameServiceAbstract {
  public staticNodes: StaticNode[] = [];
  public nodes: Node[] = [];

  public abstract runScript(
    gamestatus: Gamestatus,
    name: string,
    node: Node,
    actionA: Action,
    actionB: Action,
    actionLeft: Action,
    actionRight: Action,
    actionUp: Action,
    actionDown: Action
  ): void;
}
