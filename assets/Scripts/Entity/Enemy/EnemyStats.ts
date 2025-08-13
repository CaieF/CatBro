import { randomRangeInt } from "cc";
import { IEnemyConfig } from "../../Factory/EnemyFactory";

/**
 * 敌人属性类
 */
export class EnemyStats {
    public name: string;               // 敌人名称
    public helath: number;              // 生命值
    public damage: number;              // 伤害
    // private helathLevel: number;        // 生命值成长
    // private damageLevel: number;        // 伤害成长
    public speed: number;               // 速度
    // public minSpeed: number;            // 最小速度
    // public maxSpeed: number;            // 最大速度
    public dropMaterial: number;        // 掉落材料数量
    public dropConsimable: number;      // %掉落消耗品概率
    public dropChest: number;           // %掉落宝箱概率

    public constructor(config: IEnemyConfig, level: number) {
        this.name = config.name;
        this.helath = config.health + (level - 1) * config.healthLevel;
        this.damage = config.damage + (level - 1) * config.damageLevel;
        this.speed = randomRangeInt(config.minSpeed, config.maxSpeed + 1);
        this.dropMaterial = config.dropMaterial;
        this.dropConsimable = config.dropConsimable;
        this.dropChest = config.dropChest;
    }
}