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

    /**
     * 进入状态
     */
    public abstract enter(): void;

    /**
     * 退出状态
     */
    public abstract exit(): void;

    /**
     * 状态更新
     * @param dt 
     */
    public abstract tick(dt: number): void;

    /**
     * 状态渲染
     * @param data 武器数据
     */
    public abstract render(data: IWeapon): void;
}