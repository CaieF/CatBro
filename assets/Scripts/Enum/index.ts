
/**
 * 事件枚举
 */
export enum EventEnum {
    ActorDamage = "ActorDamage",    // 角色受伤事件
    EnemyDamage = "EnemyDamage",    // 敌人受伤事件
    EnemyChangeState = "EnemyChangeState",  // 敌人状态改变事件
    BulletBorn = "BulletBorn",    // 子弹生成事件
    BulletDestory = "BulletDestory",    // 子弹销毁事件
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
}