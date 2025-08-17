import { Animation, AnimationState, tween, Tween, Vec3 } from "cc";
import { AnimationTypeEnum, IEnemy } from "../../../Common";
import { EnemyState } from "../EnemyState";
import DataManager from "../../../Global/DataManager";
import { ObjectPoolManager } from "../../../Global/ObjectPoolManager";

export class EnemyDeadState extends EnemyState {
    private tw: Tween;

    public enter(): void {
        DataManager.Instance.enemyMap.delete(this.manager.id);
        // DataManager.Instance.state.enemies.splice(DataManager.Instance.state.enemies.indexOf(this.manager), 1);
        const scaleX = this.manager.flowDir.x >= 0 ? 1 : -1;
        this.manager.node.setScale(scaleX, 1);
        this.manager.am.play(AnimationTypeEnum.DeathAnimation);
        this.manager.am.once(Animation.EventType.FINISHED, () => {
            this.manager.recycle();
            ObjectPoolManager.Instance.ret(this.manager.node);
            
        })

    }

    public exit(): void {
        
    }

    public tick(dt: number): void {
        
    }

    public tickMove(dt: number): void {
        
    }

    public render(data: IEnemy): void {
    }
}