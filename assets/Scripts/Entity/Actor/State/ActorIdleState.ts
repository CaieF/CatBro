import { AnimationTypeEnum, IActor } from "../../../Common";
import DataManager from "../../../Global/DataManager";
import { ActorState } from "../ActorState";

export class ActorIdleState extends ActorState {
    
    public enter(): void {
        
    }

    public exit(): void {
        
    }

    public tick(dt: number): void {
        if (DataManager.Instance.jm.input.length()) {
            this.stateMachine.changeState(this.manager.moveState);
            return;
        } 
        this.manager.am.getState(AnimationTypeEnum.ScaleAnimation).speed = 1;
    } 

    public render(data: IActor): void {
        
    }
}