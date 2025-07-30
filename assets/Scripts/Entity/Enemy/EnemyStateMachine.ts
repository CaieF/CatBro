import { EnemyState } from "./EnemyState";

/**
 * 敌人状态机类
 */
export class EnemyStateMachine {
    public currentState: EnemyState;

    public constructor() {
    }
    /**
     * 初始化状态
     * @param startState 初始状态
     */
    public Initialize(startState: EnemyState): void {
        this.currentState = startState;
        this.currentState.enter();
    }

    /**
     * 改变状态
     * @param newState 新状态
     */
    public changeState(newState: EnemyState): void {
        this.currentState?.exit();
        this.currentState = newState;
        this.currentState.enter();
    }
}