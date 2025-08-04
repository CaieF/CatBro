import { IEnemy, InputTypeEnum, IWeapon } from "../../../Common";
import { getRelativePosition, getStagePosition, rad2Angle } from "../../../Util";
import { WeaponState } from "../WeaponState";
import DataManager from "../../../Global/DataManager";
import { Vec2, Vec3 } from "cc";

export class WeaponIdleState extends WeaponState {

    private target: IEnemy;
    private targetDistance: number;

    public enter(): void {
        this.manager.attackTimer = 0;
        this.target = null;
        this.targetDistance = Infinity;
    }

    public exit(): void {
        
    }

    public tick(dt: number): void {
        this.findEnemy();
        this.aimEnemy(dt);
        this.changeToAttack(dt);
        this.manager.attackTimer += dt;
    }

    public render(data: IWeapon): void {
        const { direction,position } = data;
        if (direction.x === 0 && direction.y === 0) return; // 忽略零向量，避免 atan2 异常
        
        // const angle = rad2Angle(Math.atan2(direction.y, direction.x));
        const side = Math.sqrt(direction.x ** 2 + direction.y ** 2);
        const rad = Math.asin(direction.y / side);
        const angle = direction.x > 0 ? rad2Angle(Math.asin(direction.y / side)) : rad2Angle(Math.asin(-direction.y / side)) + 180;
        this.manager.node.setRotationFromEuler(0, 0, angle);

        if (angle > 90 || angle < -90) {
            this.manager.node.setScale(new Vec3(1, -1, 1));
        } else {
            this.manager.node.setScale(new Vec3(1, 1, 1));
        }
    }

    /**
     * 寻找敌人
     */
    private findEnemy() {
        this.target = null;
        this.targetDistance = Infinity;
        const weaponStagePos = getStagePosition(this.manager.node);
        for (const data of DataManager.Instance.state.enemies) {
            const distance = Math.sqrt(Math.pow(weaponStagePos.x - data.position.x, 2) + Math.pow(weaponStagePos.y - data.position.y, 2));
            if (distance < this.targetDistance) {
                this.targetDistance = distance;
                this.target = data;
            }
        }
    }

    /**
     * 瞄准敌人 
     */
    private aimEnemy(dt: number) {
        if (this.target && this.targetDistance > 50) {
            const weaponStagePos = getStagePosition(this.manager.node);
            const { x, y } = new Vec2(this.target.position.x - weaponStagePos.x, this.target.position.y - weaponStagePos.y).normalize();
            DataManager.Instance.applyInput({
                id: this.manager.id,
                actorId: this.manager.actorId,
                type: InputTypeEnum.WeaponAim,
                direction: { x, y },
                dt,
            })
        }
    }

    /**
     * 变为攻击敌人状态
     */
    private changeToAttack(dt: number) {
        if (this.target && this.targetDistance < this.manager.attackDistance && this.manager.attackTimer > this.manager.attackInterval) {
            let enemy = DataManager.Instance.enemyMap.get(this.target.id).node;
            if (enemy) {
                // const enemyToWeaponPos = getRelativePosition(enemy, this.manager.node.parent);
                // DataManager.Instance.applyInput({
                //     id: this.manager.id,
                //     actorId: this.manager.actorId,
                //     type: InputTypeEnum.WeaponMove,
                //     position: { x: enemyToWeaponPos.x, y: enemyToWeaponPos.y },
                // })
                this.manager.behavior.responseToAttack(enemy);
                this.stateMachine.changeState(this.manager.attackState);
            }
        }
    }
}