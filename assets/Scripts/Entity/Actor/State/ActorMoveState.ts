import { AnimationTypeEnum, IActor, InputTypeEnum } from "../../../Common";
import DataManager from "../../../Global/DataManager";
import { ActorState } from "../ActorState";

export class ActorMoveState extends ActorState {

    public enter(): void {
        
    }

    public exit(): void {
        
    }

    public tick(dt: number): void {
        if (!DataManager.Instance.jm.input.length()) {
            this.stateMachine.changeState(this.manager.idleState);
            return;
        }
        const { x, y } = DataManager.Instance.jm.input;
        DataManager.Instance.applyInput({
            id: this.manager.id,
            type: InputTypeEnum.ActorMove,
            direction: { x, y },
            dt
        })
        this.manager.am.getState(AnimationTypeEnum.ScaleAnimation).speed = 2;
    }

    public render(data: IActor): void {
        const { direction, position } = data;
        this.manager.node.setPosition(position.x, position.y);

        if (direction.x !== 0) {
            this.manager.sprite.setScale(direction.x > 0 ? 1 : -1, this.manager.sprite.scale.y);
            this.manager.facingRight = direction.x > 0;
        }
    }
}