/**
 * 初始化类型
 */
export enum InitTypeEnum {
    InitWeapon = 'InitWeapon',
}

/**
 * 输入类型枚举
 */
export enum InputTypeEnum {
    ActorMove = 'ActorMove',
    EnemyMove = 'EnemyMove',
    EnemyKnockback = 'EnemyKnockback',
    WeaponAim = 'WeaponAim',
    WeaponMove = 'WeaponMove',
    TimePast = 'TimePast'
}

/**
 * 角色类型枚举
 */
export enum ActorTypeEnum {
    Actor01 = 'Actor01',
    Actor02 = 'Actor02',
}

/**
 * 敌人类型枚举
 */
export enum EnemyTypeEnum {
    Enemy01 = 'Enemy01',
}

/**
 * 武器类型枚举
 */
export enum WeaponTypeEnum {
    Weapon01 = 'Weapon01',
}

/**
 * 实体类型枚举
 */
export enum EntityTypeEnum {
    Actor = 'Actor',
    Enemy = 'Enemy',
    Weapon = 'Weapon',
    Map = 'Map',
}

/**
 * 动画类型枚举
 */
export enum AnimationTypeEnum {
    ScaleAnimation = 'ScaleAnimation',
}