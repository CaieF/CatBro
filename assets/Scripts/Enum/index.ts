
/**
 * 事件枚举
 */
export enum EventEnum {
    ActorDamage = "ActorDamage",    // 角色受伤事件
    ActorCollect = "ActorCollect",  // 角色收集物品事件
    EnemyDamage = "EnemyDamage",    // 敌人受伤事件
    EnemyChangeState = "EnemyChangeState",  // 敌人状态改变事件
    BulletBorn = "BulletBorn",    // 子弹生成事件
    BulletDestory = "BulletDestory",    // 子弹销毁事件
    UIHPUpdate = "UIHPUpdate",    // UI更新血条事件
    UIEXPUpdate = "UIEXPUpdate",    // UI更新经验条事件
    UIMoneyUpdate = "UIMoneyUpdate",    // UI更新金钱事件
    GameStart = "GameStart",    // 游戏开始事件
    GameOver = "GameOver",    // 游戏结束事件
}

/**
 * 实体状态
 */
export enum EntityStateEnum {
    Idle = "Idle",
    Move = "Move",
    Damage = "Damage",
    Attack = "Attack",
    Dead = "Dead",
}

export enum ActorStatsEnum {
    MaxHealth = "maxHealth",
    HpRegeneration = "hpRegeneration",
    LifeSteal = "lifeSteal",
    Damage = "damage",
    MeleeDamage = "meleeDamage",
    RangedDamage = "rangedDamage",
    ElementDamage = "elementDamage",
    AttackSpeed = "attackSpeed",
    CritChance = "critChance",
    Engine = "engine",
    Range = "range",
    Armor = "armor",
    Dodge = "dodge",
    Speed = "speed",
    Luck = "luck",
    Harvest = "harvest",
}

export enum EnemyStatsEnum {
    Helath = "helath",
    Damage = "damage",
    Speed = "speed",
    DropMaterial = "dropMaterial",
    DropConsimable = "dropConsimable",
    DropChest = "dropChest",
}

/**
 * 修改类型枚举
 */
export enum ModifierTypeEnum {
    StatModifier = "StatModifier",
    MultiModifier = "MultiModifier"
}

/**
 * 预制体路径
 */
export enum PrefabPathEnum {
    Map = "prefab/Map",
    Actor = "prefab/Actor",
    Enemy = "prefab/Enemy",
    Weapon01 = "prefab/weapon/Weapon01",
    Weapon02 = "prefab/weapon/Weapon02",
    Bullet = "prefab/Bullet",
    Material = "prefab/Material",
}

/**
 * 图片路径枚举
 */
export enum TexturePathEnum {
    Actor01 = "texture/actor/actor01",
    Actor02 = "texture/actor/actor02",
    Enemy01 = "texture/enemy/enemy01",
    // Weapon01 = "texture/weapon/weapon01",
    // Weapon02 = "texture/weapon/weapon02",
    Bullet01 = "texture/bullet/bullet01",
    Material01 = "texture/material/material01",
    Material02 = "texture/material/material02",
    Material03 = "texture/material/material03",
}

export enum TextureDirEnum {
    UIStrengthenIcon = "texture/ui/strengthenicon"
}

/**
 * 动画路径
 */
export enum AnimationPathEnum {
    ScaleAnimation = "animation/scaleAnimation/ScaleAnimation",
    DeathAnimation = "animation/deathAnimation/DeathAnimation"
}

/**
 * json配置文件路径
 */
export enum ConfigPathEnum {
    WeaponConfig = "config/WeaponConfig",
    ActorConfig = "config/ActorConfig",
    EnemyConfig = "config/EnemyConfig",
    StrengthenConfig = "config/StrengthenConfig", 
}

/**
 * UI类型枚举
 */
export enum UITypeEnum {
    UILevelUp = "UILevelUp",
    UILoading = "UILoading",
    UIHeroSelect = "UIHeroSelect",
    UIOver = "UIOver",
    UIStart = "UIStart",
}

/**
 * UI路径枚举
 */
export enum UIPathEnum {
    UILevelUp = "prefab/ui/UILevelUp",
    UIOver = "prefab/ui/UIOver",
}