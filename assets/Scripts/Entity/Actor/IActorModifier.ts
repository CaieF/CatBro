import { ActorStats } from "./ActorStats";

/**
 * 角色属性修改器接口
 */
export interface IActorModifier {
    /**
     * 修改角色属性
     * @param stats 角色属性
     */
    apply(stats: ActorStats): void;
}