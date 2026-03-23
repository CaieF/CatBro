import { RoundTypeEnum } from "../../../Common";
import { ActorStatsEnum } from "../../../Enum";
import { Debug, roundNum } from "../../../Util";
import {  IActorStats } from "../ActorStats";
import { IActorModifier } from "../IActorModifier";

export class ActorMultiModifier implements IActorModifier {
    constructor(private stat: ActorStatsEnum, private value: number) {
        Debug.Log('ActorMultiModifier', stat, value)
    }

    public apply(stats: IActorStats): void {
        const changeRate = (100 + this.value) / 100;
        const current = stats[this.stat];
        const result = this.value > 0 ? roundNum(current * changeRate, RoundTypeEnum.Ceil) : roundNum(current * changeRate, RoundTypeEnum.Floor);
        stats[this.stat] = result;
        // if (typeof current === 'number') {

        //     const result = this.value > 0 ? roundNum(current * changeRate, RoundTypeEnum.Ceil) : roundNum(current * changeRate, RoundTypeEnum.Floor);
        //     stats[this.stat] = result as any;
        // }
    }
}