import { ActorState } from "./ActorState";

/**
 * 角色状态机类
 */
export class ActorStateMachine {
    public currentState: ActorState;

    public constructor() {
    }
    /**
     * 初始化状态
     * @param startState 初始状态
     */
    public Initialize(startState: ActorState): void {
        this.currentState = startState;
        this.currentState.enter();
    }

    /**
     * 改变状态
     * @param newState 新状态
     */
    public changeState(newState: ActorState): void {
        this.currentState?.exit();
        this.currentState = newState;
        this.currentState.enter();
    }
}