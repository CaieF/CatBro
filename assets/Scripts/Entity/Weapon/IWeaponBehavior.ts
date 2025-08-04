import { Node } from "cc";
import { IWeapon } from "../../Common";


/**
 * 武器行为接口
 */
export interface IWeaponBehavior {

    /**
     * 响应攻击
     * @param enemy 
     */
    responseToAttack(enemy: Node);

    /**
     * 进入攻击状态
     */
    enterAttackState(): void;

    /**
     * 退出攻击状态
     */
    exitAttackState(): void;

    /**
     * 更新攻击状态
     * @param dt 时间间隔
     */
    tickAttackState(dt: number): void;

    /**
     * 渲染攻击状态
     * @param data 武器数据
     */
    renderAttackState(data: IWeapon): void;

}