import { Node, Size, tween, Tween, UITransform, Vec2, Vec3 } from "cc";
import { IWeaponBehavior } from "../IWeaponBehavior";
import { InitTypeEnum, InputTypeEnum, IVec2, IWeapon } from "../../../Common";
import { CollisionUtil, Debug, getRelativePosition, getStagePosition } from "../../../Util";
import { WeaponManager } from "../WeaponManager";
import DataManager from "../../../Global/DataManager";
import EventManager from "../../../Global/EventManager";
import { EventEnum } from "../../../Enum";
import { WeaponAttackState } from "../State";
import { WeaponStateMachine } from "../WeaponStateMachine";

/**
 * 近战武器行为表现
 */
export class MeleeBehavior implements IWeaponBehavior {
    private tw: Tween;

    private manager: WeaponManager;
    private stateMachine: WeaponStateMachine;

    public constructor(manager: WeaponManager) {
        this.manager = manager;
        this.stateMachine = manager.stateMachine;
    }

    public responseToAttack(enemy: Node): void {
        const enemyToWeaponPos = getRelativePosition(enemy, this.manager.node.parent);
        DataManager.Instance.applyInput({
            id: this.manager.id,
            actorId: this.manager.actorId,
            type: InputTypeEnum.WeaponMove,
            position: { x: enemyToWeaponPos.x, y: enemyToWeaponPos.y },
        })

    }

    public enterAttackState(): void {
        this.tw = null;
    }

    public exitAttackState(): void {
        this.tw = null;
        DataManager.Instance.applyInit({
            type: InitTypeEnum.InitWeapon,
            id: this.manager.id,
            actorId: this.manager.actorId,
            position: this.manager.defaultPos,
        })
    }
 
    public tickAttackState(dt: number): void {
        
    }

    public renderAttackState(data: IWeapon): void {
        const { direction, position } = data;
        if (!this.tw) {
            
            this.tw = tween(this.manager.node)
                .to(0.08, { position: new Vec3(position.x, position.y) })
                .call(() => {
                    this.attackEnemy(direction);
                })
                .to(0.08, { position: new Vec3(this.manager.defaultPos.x, this.manager.defaultPos.y) })
                .call(() => {
                    this.stateMachine.changeState(this.manager.idleState);
                })
                .start();
        }
    }
    
    /**
     * 攻击敌人
     * @param direction 击退方向 
     */
    public attackEnemy(direction: IVec2): void {
        // TODO
        const weaponStagePos = getStagePosition(this.manager.node);
        const rotation = this.manager.node.eulerAngles.z * Math.PI / 180;
        const weaponCenter = new Vec2(weaponStagePos.x, weaponStagePos.y);
        const weaponSize = this.manager.node.getComponent(UITransform).contentSize;
        const weaponPoints = CollisionUtil.getRotatedRectPoints(weaponCenter, weaponSize.width, weaponSize.height, rotation);
        for (const enemy of DataManager.Instance.state.enemies) {
            const enemyCenter = new Vec2(enemy.position.x, enemy.position.y);
            const enemySize = new Size(100, 100);
            const enemyPoints = CollisionUtil.getAABBPoints(enemyCenter, enemySize.width, enemySize.height);
            if (CollisionUtil.isPolygonCollide(weaponPoints, enemyPoints)) {
                EventManager.Instance.emit(EventEnum.EnemyDamage, enemy.id, direction);
            }
        }
    }
}