import { WeaponState } from "./WeaponState";

/**
 * 武器状态机类
 */
export class WeaponStateMachine {
    public currentState: WeaponState;

    public constructor() {
    }
    /**
     * 初始化状态
     * @param startState 初始状态
     */
    public Initialize(startState: WeaponState): void {
        this.currentState = startState;
        this.currentState.enter();
    }

    /**
     * 改变状态
     * @param newState 新状态
     */
    public changeState(newState: WeaponState): void {
        this.currentState?.exit();
        this.currentState = newState;
        this.currentState.enter();
    }
}