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
    WeaponShoot = 'WeaponShoot',
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
    Weapon02 = 'Weapon02',
}

/**
 * 子弹类型枚举
 */
export enum BulletTypeEnum {
    Bullet01 = 'Bullet01',
}

/**
 * 武器攻击类型枚举
 */
export enum WeaponAttackTypeEnum {
    Melee = 'Melee',
    Ranged = 'Ranged',
}


/**
 * 实体类型枚举
 */
export enum EntityTypeEnum {
    Actor = 'Actor',
    Enemy = 'Enemy',
    Weapon01 = 'Weapon01',
    Weapon02 = 'Weapon02',
    Bullet = 'Bullet',
    Map = 'Map',
}

/**
 * 动画类型枚举
 */
export enum AnimationTypeEnum {
    ScaleAnimation = 'ScaleAnimation',
}

export enum ConfigTypeEnum {
    WeaponConfig = 'WeaponConfig'
}