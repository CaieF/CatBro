import { ActorTypeEnum, InputTypeEnum } from "./Enum";

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
}

/**
 * 游戏状态接口
 */
export interface IState {
    actors: IActor[];
}

/**
 * 输入接口
 */
export type IClientInput = IActorMoveInput;

/**
 * 角色移动输入接口
 */
export interface IActorMoveInput {
    id: number;
    type: InputTypeEnum.ActorMove;
    direction: IVec2;
    dt: number;
}