import { ActorStatsEnum } from "../../../Enum";
import { Debug } from "../../../Util";
import { IActorStats } from "../ActorStats";
import { IActorModifier } from "../IActorModifier";

/**
 * 通用角色修改类
 */
export class ActorStatModifier implements IActorModifier {
    public constructor(private stat: ActorStatsEnum, private value: number) {
        Debug.Log('AcyorStatModifier', stat, value)
    }

    apply(stats: IActorStats): void {
        const key = this.stat;
        // const current = stats[key];
        stats[key] += this.value;
        // if (typeof current === 'number') {
        //     stats[key] = (current + this.value) as any;
        // }
    }
}