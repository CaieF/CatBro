import { IActor } from "../../Common";
import { ActorManager } from "./ActorManager";
import { ActorStateMachine } from "./ActorStateMachin";

/**
 * 角色状态类
 */
export abstract class ActorState {

    protected manager: ActorManager;
    protected stateMachine: ActorStateMachine;
    
    /**
     * @param manager 角色管理器
     * @param stateMachine 状态机
     */
    public constructor(manager: ActorManager, stateMachine: ActorStateMachine) {
        this.manager = manager;
        this.stateMachine = stateMachine;
    }

    public abstract enter(): void;
    public abstract exit(): void;
    public abstract tick(dt: number): void;
    public abstract render(data: IActor): void;
}