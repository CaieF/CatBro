import Singleton from "../Base/Singleton";
import { ConfigTypeEnum, WeaponAttackTypeEnum, WeaponTypeEnum } from "../Common";
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
    private weaponConfig: Record<WeaponTypeEnum, IWeaponConfig>;

    public static get Instance() {
        return super.GetInstance<WeaponFactory>();
    }

    public init(): void {
        const config = DataManager.Instance.configMap.get(ConfigTypeEnum.WeaponConfig).json;
        this.weaponConfig = config as Record<WeaponTypeEnum, IWeaponConfig>;
        Debug.Log(Tag, "武器配置加载", this.weaponConfig);
    }

    /**
     * 创建武器属性
     * @param type 武器类型
     */
    public createWeaponStats(type: WeaponTypeEnum): WeaponStats {
        const config = this.weaponConfig[type];
        if (!config) {
            throw new Error(`武器配置不存在 ${type}`);
        }
        const stats = new WeaponStats(config);
        return stats;
    }
}