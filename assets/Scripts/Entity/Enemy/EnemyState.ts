import { IEnemy } from "../../Common";
import { EnemyManager } from "./EnemyManager";
import { EnemyStateMachine } from "./EnemyStateMachine";

/**
 * 敌人状态类
 */
export abstract class EnemyState {

    protected manager: EnemyManager;
    protected stateMachine: EnemyStateMachine;
    
    /**
     * @param manager 敌人管理器
     * @param stateMachine 状态机
     */
    public constructor(manager: EnemyManager, stateMachine: EnemyStateMachine) {
        this.manager = manager;
        this.stateMachine = stateMachine;
    }

    public abstract enter(): void;
    public abstract exit(): void;
    public abstract tick(dt: number): void;
    public abstract tickMove(dt: number): void;
    public abstract render(data: IEnemy): void;
}