import { Animation, UI } from "cc";
import { AnimationTypeEnum, IActor } from "../../../Common";
import DataManager from "../../../Global/DataManager";
import { ActorState } from "../ActorState";
import { UIManager } from "../../../Global/UIManager";
import { UITypeEnum } from "../../../Enum";


export class ActorDeadState extends ActorState {
    
    public enter(): void {
        DataManager.Instance.actorDead(this.manager.id);
        // DataManager.Instance.actorMap.delete(this.manager.id);
        this.manager.weapons.active = false;

        const scaleX = this.manager.facingRight ? 1 : -1;
        this.manager.node.setScale(scaleX, 1);
        this.manager.am.play(AnimationTypeEnum.DeathAnimation);
        this.manager.am.once(Animation.EventType.FINISHED, () => {
            DataManager.Instance.myPlayer = null;
            this.manager.node.destroy();
            UIManager.Instance.openPanel(UITypeEnum.UIOver);
        });
    }

    public exit(): void {}

    public tick(dt: number): void {}

    public render(data: IActor): void {}
}