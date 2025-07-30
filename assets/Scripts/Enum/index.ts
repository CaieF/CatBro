
/**
 * 事件枚举
 */
export enum EventEnum {
    EnemyDamage = "EnemyDamage",    // 敌人受伤事件
}

/**
 * 实体状态
 */
export enum EntityStateEnum {
    Idle = "Idle",
    Move = "Move",
    Damage = "Damage",
    Attack = "Attack",
}

/**
 * 预制体路径
 */
export enum PrefabPathEnum {
    Map = "prefab/Map",
    Actor = "prefab/Actor",
    Enemy = "prefab/Enemy",
    Weapon = "prefab/Weapon"
}

/**
 * 图片路径枚举
 */
export enum TexturePathEnum {
    Actor01 = "texture/actor/actor01",
    Actor02 = "texture/actor/actor02",
    Enemy01 = "texture/enemy/enemy01",
    Weapon01 = "texture/weapon/weapon01",
}

/**
 * 动画路径
 */
export enum AnimationPathEnum {
    ScaleAnimation = "animation/scaleAnimation/ScaleAnimation"
}