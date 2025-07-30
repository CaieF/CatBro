import { IWeapon } from "../../Common";
import { WeaponManager } from "./WeaponManager";
import { WeaponStateMachine } from "./WeaponStateMachine";

/**
 * 武器状态类
 */
export abstract class WeaponState {
    
    protected manager: WeaponManager;
    protected stateMachine: WeaponStateMachine;
    
    /**
     * @param manager 武器管理器
     * @param stateMachine 状态机
     */
    public constructor(manager: WeaponManager, stateMachine: WeaponStateMachine) {
        this.manager = manager;
        this.stateMachine = stateMachine;
    }

    public abstract enter(): void;
    public abstract exit(): void;
    public abstract tick(dt: number): void;
    public abstract render(data: IWeapon): void;
}