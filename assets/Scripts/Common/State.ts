import { ActorTypeEnum, BulletTypeEnum, EnemyTypeEnum, InitTypeEnum, InputTypeEnum, WeaponAttackTypeEnum, WeaponTypeEnum } from "./Enum";

export interface IVec2 {
    x: number;
    y: number;
}

/**
 * 角色接口
 */
export interface IActor {
    id: number;
    position: IVec2;
    direction: IVec2;
    type: ActorTypeEnum;
    weaponList: IWeapon[];
}

export interface IWeapon {
    id: number;
    position: IVec2;
    direction: IVec2;
    type: WeaponTypeEnum;
    attackType: WeaponAttackTypeEnum;
    bulletType?: BulletTypeEnum;
}

/**
 * 敌人接口
 */
export interface IEnemy {
    id: number;
    position: IVec2;
    direction: IVec2;
    type: EnemyTypeEnum;
}

export interface IBullet {
    id: number;
    position: IVec2;
    direction: IVec2;
    type: BulletTypeEnum;
}

/**
 * 游戏状态接口
 */
export interface IState {
    actors: IActor[];
    enemies: IEnemy[];
    bullets: IBullet[];
    nextBulletId: number;
}

/**
 * 初始化接口
 */
export type IClientInit = IWeaponInit;

/**
 * 武器初始化
 */
export interface IWeaponInit {
    id: number;
    actorId: number;
    type: InitTypeEnum.InitWeapon;
    position: IVec2;
}

/**
 * 输入接口
 */
export type IClientInput = IActorMoveInput | IEnemyMoveInput | IEnemyKnockbackInput | IWeaponAimInput | IWeaponMoveInput | IWeaponShootInput
 | ITimePastInput;

/**
 * 角色移动输入接口
 */
export interface IActorMoveInput {
    id: number;
    type: InputTypeEnum.ActorMove;
    direction: IVec2;
    dt: number;
}

/**
 * 敌人移动输入接口
 */
export interface IEnemyMoveInput {
    id: number;
    type: InputTypeEnum.EnemyMove;
    direction: IVec2;
    speed: number;
    dt: number;
}

/**
 * 敌人击退输入接口
 */
export interface IEnemyKnockbackInput {
    id: number;
    type: InputTypeEnum.EnemyKnockback;
    direction: IVec2;
    force: number;
}

/**
 * 武器瞄准输入接口
 */
export interface IWeaponAimInput {
    id: number;
    actorId: number;
    type: InputTypeEnum.WeaponAim;
    direction: IVec2;
    dt: number;
}

export interface IWeaponMoveInput {
    id: number;
    actorId: number;
    type: InputTypeEnum.WeaponMove;
    position: IVec2;
}

export interface IWeaponShootInput 
{
    type: InputTypeEnum.WeaponShoot;
    bulletType: BulletTypeEnum;
    position: IVec2;    // 武器位置
    direction: IVec2;   // 射击方向
}

export interface ITimePastInput {
    type: InputTypeEnum.TimePast;
    dt: number;
}
