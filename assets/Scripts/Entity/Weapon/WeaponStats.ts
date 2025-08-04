import { WeaponAttackTypeEnum, WeaponTypeEnum } from "../../Common";
import { IWeaponConfig } from "../../Factory/WeaponFactory";

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
    
    public constructor(config: IWeaponConfig) {
        this.name = config.name;
        this.baseDamage = config.baseDamage;
        this.meleeAddDamage = config.meleeAddDamage;
        this.rangedAddDamage = config.rangedAddDamage;
        this.elementAddDamage = config.elementAddDamage;
        this.attackInterval = config.attackInterval;
        this.attackRange = config.attackRange;
        this.attackType = config.attackType;
    }
}