import { Node, Vec2 } from "cc";
import { IWeaponBehavior } from "../IWeaponBehavior";
import { BulletTypeEnum, InputTypeEnum, IWeapon } from "../../../Common";
import { Debug, getStagePosition } from "../../../Util";
import { WeaponManager } from "../WeaponManager";
import { WeaponStateMachine } from "../WeaponStateMachine";
import DataManager from "../../../Global/DataManager";

const Tag = 'RangedBehavior'
/**
 * 远程武器行为表现
 */
export class RangedBehavior implements IWeaponBehavior {

    private manager: WeaponManager;
    private stateMachine: WeaponStateMachine;

    public constructor(mamager: WeaponManager){
        this.manager = mamager;
        this.stateMachine = mamager.stateMachine;
    }


    public responseToAttack(enemy: Node): void {
        const weaponStagePos = getStagePosition(this.manager.point);
        const { x,y } = new Vec2(enemy.position.x - weaponStagePos.x, enemy.position.y - weaponStagePos.y).normalize();
        DataManager.Instance.applyInput({
            type: InputTypeEnum.WeaponShoot,
            bulletType: BulletTypeEnum.Bullet01,
            position: weaponStagePos,
            direction: { x, y }
        })
    }
    
    public enterAttackState(): void {
        Debug.Log(Tag, '进入远程攻击状态');
        this.stateMachine.changeState(this.manager.idleState);

    }

    public exitAttackState(): void {
        Debug.Log(Tag, '退出远程攻击状态');
    }

    public tickAttackState(dt: number): void {}

    public renderAttackState(data: IWeapon): void {
        
    }
}