import { RoundTypeEnum } from "../../Common";
import { ActorStatsEnum, ModifierTypeEnum } from "../../Enum";
import { IModifier } from "../../Factory/ActorFactory";
import { Debug, roundNum } from "../../Util";
import { ActorMultiModifier } from "./Modifier";
import { ActorStatModifier } from "./Modifier/ActorStatModifier";

/**
 * 角色初始属性
 */
const baseStats: IActorStats = {
    maxHealth: 10,
    hpRegeneration: 0,
    lifeSteal: 0,
    damage: 0,
    meleeDamage: 0,
    rangedDamage: 0,
    elementDamage: 0,
    attackSpeed: 0,
    critChance: 0,
    engine: 0,
    range: 0,
    armor: 0,
    dodge: 0,
    speed: 0,
    luck: 0,
    harvest: 0,
}

export interface IActorStats {
    maxHealth: number;       // 最大生命值
    hpRegeneration: number;  // 生命再生
    lifeSteal: number;      // %生命窃取
    damage: number;         // %伤害
    meleeDamage: number;    // 近战伤害
    rangedDamage: number;   // 远程伤害
    elementDamage: number;  // 元素伤害
    attackSpeed: number;    // %攻击速度
    critChance: number;     // %暴击率
    engine: number;         // 工程学
    range: number;          // 范围 
    armor: number;          // 护甲 
    dodge: number;          // %闪避
    speed: number;          // 百分比速度
    luck: number;           // 幸运
    harvest: number;        // 收获
}


export class ActorStats {
    public currentLevel: number;    // 当前等级
    public currentHealth: number;   // 当前生命

    private stats: IActorStats;

    private statModifiers: ActorStatModifier[] = []; // 通用修改
    private multiModifiers: ActorMultiModifier[] = []; // 百分比修改

    public constructor(modifiers: IModifier[]) {
        this.currentLevel = 0;

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

    public levelUp(): void {
        this.currentLevel += 1;
        this.statModifiers.push(new ActorStatModifier(ActorStatsEnum.MaxHealth, 1));
        this.updateStats();
    }

    public addStrengthenModifier(statModifier: ActorStatModifier): void {
        // this.statModifiers.push(new ActorStatModifier(statModifier.stat, statModifier.value));
        this.statModifiers.push(statModifier);
        this.updateStats();
    }

    /**
     * 更新属性
     */
    public updateStats(): void {
        // 每次更新先重置
        // Object.assign(this.stats, baseStats);
        this.stats = {...baseStats }

        for (const modifier of this.statModifiers) {
            modifier.apply(this.stats);
        }
        for (const modifier of this.multiModifiers) {
            modifier.apply(this.stats);
        }
        this.currentHealth = this.stats.maxHealth;
    }

    /** 获取角色属性 */
    public get(stat: ActorStatsEnum): number{
        return this.stats[stat];
    }

    public get finalSpeed(): number {
        Debug.Log('finalSpeed', ActorStatsEnum.Speed)
        Debug.Log('finalSpeed', this.get(ActorStatsEnum.Speed))

        const speed = 450 * (100 + this.get(ActorStatsEnum.Speed)) / 100;
        
        return roundNum(speed, RoundTypeEnum.Ceil);
    }

    /**
     * newdamage = damage - damage * armor / (armor + 15)
     * @param damage 敌人原始伤害
     */
    public getFinalDamage(damage: number): number {
        let newdamage: number = roundNum(damage - damage * this.get(ActorStatsEnum.Armor) / (this.get(ActorStatsEnum.Armor) + 15), RoundTypeEnum.Floor);
        newdamage = newdamage < 1 ? 1 : newdamage;
        return newdamage;
    }

    public getAll(): Readonly<IActorStats> {
        return this.stats;
    }
}