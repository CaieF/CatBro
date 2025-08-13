import { RoundTypeEnum } from "../../../Common";
import { Debug, roundNum } from "../../../Util";
import { ActorStats } from "../ActorStats";
import { IActorModifier } from "../IActorModifier";

export class ActorMultiModifier implements IActorModifier {
    constructor(private stat: keyof ActorStats, private value: number) {
        Debug.Log('ActorMultiModifier', stat, value)
    }

    public apply(stats: ActorStats): void {
        const changeRate = (100 + this.value) / 100;
        const current = stats[this.stat];
        if (typeof current === 'number') {

            const result = this.value > 0 ? roundNum(current * changeRate, RoundTypeEnum.Ceil) : roundNum(current * changeRate, RoundTypeEnum.Floor);
            stats[this.stat] = result as any;
        }
    }
}