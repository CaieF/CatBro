import Singleton from "../Base/Singleton";
import { ConfigTypeEnum, EnemyEntityTypeEnum } from "../Common";
import { EnemyStats } from "../Entity/Enemy/EnemyStats";
import DataManager from "../Global/DataManager";
import { Debug } from "../Util";

const Tag = 'EnemyFactory';
export interface IEnemyConfig {
    name: string;
    health: number;
    damage: number;
    healthLevel: number;
    damageLevel: number;
    minSpeed: number;
    maxSpeed: number;
    dropMaterial: number;
    dropConsimable: number;
    dropChest: number;
}

/**
 * 敌人工厂
 */
export class EnemyFactory extends Singleton {
    private enemyConfig: Record<EnemyEntityTypeEnum, IEnemyConfig>;

    public static get Instance() {
        return super.GetInstance<EnemyFactory>();
    }

    public init(): void {
        const config = DataManager.Instance.configMap.get(ConfigTypeEnum.EnemyConfig).json;
        this.enemyConfig = config as Record<EnemyEntityTypeEnum, IEnemyConfig>;
        // Debug.Log(Tag, "敌人配置加载", this.enemyConfig);
    }

    public createEnemyStats(type: EnemyEntityTypeEnum, level: number): EnemyStats {
        const config = this.enemyConfig[type];
        if (!config) {
            throw new Error(`敌人配置不存在 ${type}`);
        }
        const stats = new EnemyStats(config, level);
        return stats;
    }
}