import Singleton from "../Base/Singleton";
import { ConfigTypeEnum, WeaponAttackTypeEnum, WeaponEntityTypeEnum } from "../Common";
import { ActorStats } from "../Entity/Actor/ActorStats";
import { MeleeBehavior, RangedBehavior } from "../Entity/Weapon/Behavior";
import { IWeaponBehavior } from "../Entity/Weapon/IWeaponBehavior";
import { WeaponManager } from "../Entity/Weapon/WeaponManager";
import { WeaponStats } from "../Entity/Weapon/WeaponStats";
import DataManager from "../Global/DataManager";
import { Debug } from "../Util";

const Tag = 'WeaponFactory';

/**
 * 武器配置接口
 */
export interface IWeaponConfig {
    name: string;
    baseDamage: number;
    meleeAddDamage: number;
    rangedAddDamage: number;
    elementAddDamage: number;
    attackInterval: number;
    attackRange: number;
    attackType: WeaponAttackTypeEnum;
}


/**
 * 武器工厂类
 * 负责通过武器类型创建武器配置
 */
export class WeaponFactory extends Singleton {
    private weaponConfig: Record<WeaponEntityTypeEnum, IWeaponConfig>;

    public static get Instance() {
        return super.GetInstance<WeaponFactory>();
    }

    public init(): void {
        const config = DataManager.Instance.configMap.get(ConfigTypeEnum.WeaponConfig).json;
        this.weaponConfig = config as Record<WeaponEntityTypeEnum, IWeaponConfig>;
        Debug.Log(Tag, "武器配置加载", this.weaponConfig);
    }

    /**
     * 创建武器属性
     * @param type 武器类型
     * @param as 角色属性
     */
    public createWeaponStats(type: WeaponEntityTypeEnum, as: ActorStats): WeaponStats {
        const config = this.weaponConfig[type];
        if (!config) {
            throw new Error(`武器配置不存在 ${type}`);
        }
        const stats = new WeaponStats(config, as);
        return stats;
    }

    /**
     * 创建武器表现行为
     * @param type 武器攻击类型
     * @param manager 武器管理器
     * @returns 
     */
    public createWeaponBehavior(type: WeaponAttackTypeEnum, manager: WeaponManager): IWeaponBehavior {
        switch (type) {
            case WeaponAttackTypeEnum.Melee:
                return new MeleeBehavior(manager);
            case WeaponAttackTypeEnum.Ranged:
                manager.point = manager.node.getChildByName('Point');
                return new RangedBehavior(manager);
            default:
                throw new Error(`武器攻击类型不存在 ${type}`);
        }
    }
}