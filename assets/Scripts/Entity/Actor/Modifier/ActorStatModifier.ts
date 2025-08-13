import { Debug } from "../../../Util";
import { ActorStats } from "../ActorStats";
import { IActorModifier } from "../IActorModifier";

/**
 * 通用角色修改类
 */
export class ActorStatModifier implements IActorModifier {
    public constructor(private stat: keyof ActorStats, private value: number) {
        Debug.Log('AcyorStatModifier', stat, value)
    }

    apply(stats: ActorStats): void {
        const key = this.stat;
        const current = stats[key];
        if (typeof current === 'number') {
            stats[key] = (current + this.value) as any;
        }
    }
}