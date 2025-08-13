import { RoundTypeEnum, WeaponAttackTypeEnum, WeaponEntityTypeEnum } from "../../Common";
import { IWeaponConfig } from "../../Factory/WeaponFactory";
import { Debug, roundNum } from "../../Util";
import { ActorStats } from "../Actor/ActorStats";

/**
 * 武器属性类
 */
export class WeaponStats {
    public name: string;               // 武器名称
    public baseDamage: number;          // 基础伤害
    public meleeAddDamage: number;      // 近战附加伤害
    public rangedAddDamage: number;     // 远程附加伤害
    public elementAddDamage: number;    // 元素伤害
    public attackInterval: number;      // 攻击间隔
    public attackRange: number;         // 攻击范围
    public attackType: WeaponAttackTypeEnum;    // 攻击类型

    private as: ActorStats;  // 武器所属角色属性
    
    public constructor(config: IWeaponConfig, as: ActorStats) {
        this.name = config.name;
        this.baseDamage = config.baseDamage;
        this.meleeAddDamage = config.meleeAddDamage;
        this.rangedAddDamage = config.rangedAddDamage;
        this.elementAddDamage = config.elementAddDamage;
        this.attackInterval = config.attackInterval;
        this.attackRange = config.attackRange;
        this.attackType = config.attackType;

        this.as = as;
    }

    /**
     * 返回最终攻击范围
     * @description 计算公式： 武器攻击范围 + 角色范围 * 武器攻击类型（近战/远程）
     * @returns 最终攻击范围
     */
    public get finalRange(): number {
        return (this.attackRange + this.as.range * (this.attackType === WeaponAttackTypeEnum.Ranged? 1 : 0.5));
    }

    /**
     * 武器造成的最终伤害
     * @description 计算公式： (武器基础伤害 + 角色（近战/远程/元素）伤害加成 * 武器对应附加伤害) * 角色百分比伤害加成
     * @returns 最终伤害
     */
    public get finalDamage() {
        const damage = (this.baseDamage + this.as.elementDamage * this.elementAddDamage + this.as.meleeDamage * this.meleeAddDamage + this.as.rangedDamage * this.rangedAddDamage) * (1 + this.as.damage)
        return roundNum(damage, RoundTypeEnum.Floor);
    }
}
