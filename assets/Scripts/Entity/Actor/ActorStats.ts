import { ModifierTypeEnum } from "../../Enum";
import { IModifier } from "../../Factory/ActorFactory";
import { ActorMultiModifier } from "./Modifier";
import { ActorStatModifier } from "./Modifier/ActorStatModifier";

/**
 * 角色初始属性
 */
const baseStats: Partial<ActorStats> = {
    currentHealth: 10,
    maxHealth: 10,
    hpRegeneration: 0,
    lifeSteal: 0,
    damage: 0,
    meleeDamage: 0,
    rangedDamage: 0,
    elementDamage: 0,
    attackSpeed: 0,
    critChance: 0,
    range: 0,
    armor: 0,
    dodge: 0,
    speed: 0,
    luck: 0,
    harvest: 0,
}

export class ActorStats {
    public currentLevel: number;    // 当前等级
    public currentHealth: number;   // 当前生命
    public maxHealth: number;       // 最大生命值
    public hpRegeneration: number;  // 生命再生
    public lifeSteal: number;       // %生命窃取
    public damage: number;          // %伤害
    public meleeDamage: number;     // 近战伤害
    public rangedDamage: number;    // 远程伤害
    public elementDamage: number;   // 元素伤害
    public attackSpeed: number;     // %攻击速度
    public critChance: number;      // %暴击率
    public range: number;           // 范围
    public armor: number;           // 护甲
    public dodge: number;           // %闪避
    public speed: number;           // 百分比速度
    public luck: number;            // 幸运
    public harvest: number;         // 收获

    private statModifiers: ActorStatModifier[] = []; // 通用修改
    private multiModifiers: ActorMultiModifier[] = []; // 百分比修改

    public constructor(modifiers: IModifier[]) {
        this.currentLevel = 1;

        for (const modifier of modifiers) {
            switch (modifier.type) {
                case ModifierTypeEnum.StatModifier:
                    this.statModifiers.push(new ActorStatModifier(modifier.stat, modifier.value));
                    break;
                case ModifierTypeEnum.MultiModifier:
                    this.multiModifiers.push(new ActorMultiModifier(modifier.stat, modifier.value));
                    break;
            }
        }
        this.updateStats();
    }



    /**
     * 更新属性
     */
    public updateStats(): void {
        // 每次更新先重置
        Object.assign(this, baseStats);

        for (const modifier of this.statModifiers) {
            modifier.apply(this);
        }
        for (const modifier of this.multiModifiers) {
            modifier.apply(this);
        }
    }
}