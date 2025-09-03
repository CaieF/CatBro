import { math, Vec2 } from "cc";
import { AnimationTypeEnum, IActor, IEnemy, InputTypeEnum, RoundTypeEnum } from "../../../Common";
import DataManager, { ENEMY_SPEED } from "../../../Global/DataManager";
import { EnemyState } from "../EnemyState";
import { RVOManager } from "../../../Global/RVOManager";
import EventManager from "../../../Global/EventManager";
import { EventEnum } from "../../../Enum";
import { roundNum } from "../../../Util";

export class EnemyMoveState extends EnemyState {
    private target: IActor;
    private targetDistance: number;
    private stopDistance: number = 50;  // 停止移动的距离,防止重合左右旋转

    public enter(): void {
        this.target = null;
        this.targetDistance = Infinity;
    }

    public exit(): void {
        
    }

    public tick(dt: number): void {
        this.findActor();
        this.setPreDir();
    }

    public tickMove(dt: number): void {
        const rvoVelocity = RVOManager.Instance.getVelocity(this.manager.id);

        DataManager.Instance.applyInput({
            id: this.manager.id,
            type: InputTypeEnum.EnemyMove,
            direction: rvoVelocity.clone().normalize(),
            speed: rvoVelocity.length(),
            dt,
        });

        this.manager.am.getState(AnimationTypeEnum.ScaleAnimation).speed = rvoVelocity.lengthSqr() > 0.001 ? 2 : 1;  // 调整播放速度
    }

    public render(data: IEnemy): void {
        const { position, direction } = data;
        this.manager.node.setPosition(position.x, position.y);

        const isRight = this.manager.flowDir.x > 0;
        this.manager.sprite.setScale(isRight ? 1 : -1, this.manager.sprite.scale.y);
    }

    /**
     * 寻找玩家
     */
    private findActor(): void {
        for (const data of DataManager.Instance.state.actors) {
            const distance = Math.sqrt(Math.pow(data.position.x - data.position.x, 2) + Math.pow(data.position.y - data.position.y, 2));
            if (distance < this.targetDistance) {
                this.target = data;
                this.targetDistance = distance;
            }
        }
    }

    /**
     * 设置预期方向
     */
    private setPreDir() {
        const worldPos = this.manager.node.worldPosition;
        const worldPos2D = new Vec2(worldPos.x, worldPos.y);
        RVOManager.Instance.updateAgentPosition(this.manager.id, worldPos2D, this.manager.stats.speed);

        if (!this.target) {
            return;
        }
        const distance = Math.sqrt(Math.pow(this.target.position.x - this.manager.node.position.x, 2) + Math.pow(this.target.position.y - this.manager.node.position.y, 2));
        if (distance < 100) {

            EventManager.Instance.emit(EventEnum.ActorDamage, this.target.id, this.manager.stats.damage);
        }

        if (distance < this.stopDistance) {
            RVOManager.Instance.setPreferVelocity(this.manager.id, new Vec2(0, 0));
            return;
        }

        const flowDir = new Vec2(this.target.position.x - this.manager.node.position.x, this.target.position.y - this.manager.node.position.y).normalize();
        this.manager.flowDir = flowDir;
        RVOManager.Instance.setPreferVelocity(this.manager.id, flowDir.multiplyScalar(ENEMY_SPEED));
    }
}