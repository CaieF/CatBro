import { tween, Tween, Vec3 } from "cc";
import { WeaponState } from "../WeaponState";
import { InitTypeEnum, IVec2, IWeapon } from "../../../Common";
import { getStagePosition } from "../../../Util";
import DataManager from "../../../Global/DataManager";
import EventManager from "../../../Global/EventManager";
import { EventEnum } from "../../../Enum";

export class WeaponAttackState extends WeaponState { 
    private tw: Tween;

    public enter(): void {
        this.tw = null;
    }

    public exit(): void {
        this.tw = null;
    }

    public tick(dt: number) {}

    public render(data: IWeapon): void {
        const { direction, position } = data;
        if (!this.tw) {
            this.tw = tween(this.manager.node)
                .to(0.08, { position: new Vec3(position.x, position.y) })
                .call(() => {
                    this.attackEnemy(direction);
                })
                .to(0.08, { position: new Vec3(this.manager.defaultPos.x, this.manager.defaultPos.y) })
                .call(() => {
                    this.changeToIdle();
                })
                .start();
        }
    }

    /**
     * 攻击敌人
     * @param direction 击退方向
     */
    private attackEnemy(direction: IVec2): void {
        const weaponStagePos = getStagePosition(this.manager.node);
        let number = 0;
        for (const enemy of DataManager.Instance.state.enemies) {
            if (Math.sqrt(Math.pow(enemy.position.x - weaponStagePos.x, 2) + Math.pow(enemy.position.y - weaponStagePos.y, 2)) < 60) {
                EventManager.Instance.emit(EventEnum.EnemyDamage, enemy.id, direction);
                number++;
            }
        }
    }

    /**
     * 切换到空闲状态
     */
    private changeToIdle(): void {
        this.stateMachine.changeState(this.manager.idleState);
        this.manager.attackTimer = 0;
        DataManager.Instance.applyInit({
            type: InitTypeEnum.InitWeapon,
            id: this.manager.id,
            actorId: this.manager.actorId,
            position: this.manager.defaultPos,
        })
        this.tw = null;
    }
}