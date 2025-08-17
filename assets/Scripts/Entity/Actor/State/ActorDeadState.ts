import { Animation } from "cc";
import { AnimationTypeEnum, IActor } from "../../../Common";
import DataManager from "../../../Global/DataManager";
import { ActorState } from "../ActorState";


export class ActorDeadState extends ActorState {
    
    public enter(): void {
        DataManager.Instance.actorDead(this.manager.id);
        DataManager.Instance.actorMap.delete(this.manager.id);
        this.manager.weapons.active = false;

        const scaleX = this.manager.facingRight ? 1 : -1;
        this.manager.node.setScale(scaleX, 1);
        this.manager.am.play(AnimationTypeEnum.DeathAnimation);
        this.manager.am.once(Animation.EventType.FINISHED, () => {
            DataManager.Instance.myPlayer = null;
            this.manager.node.destroy();
        });
    }

    public exit(): void {}

    public tick(dt: number): void {}

    public render(data: IActor): void {}
}