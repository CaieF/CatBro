import Singleton from "../Base/Singleton";
import { ConfigTypeEnum } from "../Common";
import { ActorStats } from "../Entity/Actor/ActorStats";
import DataManager from "../Global/DataManager";
import { Debug } from "../Util";

const Tag = 'LevelFactory';

interface IStrengthenModifier {
    level: string;
    value: number;
}
export interface IStrengthenConfig {
    name: string;
    modifiers: IStrengthenModifier[];
    description: string;
}

export interface IStrengthenResult {
    name: string;
    stats: keyof ActorStats;
    modifier: IStrengthenModifier;
    description: string;
}

export class StrengthenFactory extends Singleton {
    private StrengthenConfig: Record<string, IStrengthenConfig>;

    public static get Instance() {
        return super.GetInstance<StrengthenFactory>();
    }

    public init(): void {
        const config = DataManager.Instance.configMap.get(ConfigTypeEnum.LevelConfig).json;
        this.StrengthenConfig = config as Record<string, IStrengthenConfig>;
        Debug.Log(Tag, "等级配置加载", this.StrengthenConfig);
    }

    /**
     * 创建四个随机属性的随机等级强化
     */
    public createLevel(): IStrengthenResult[] {
        const results: IStrengthenResult[] = [];

        const availableStats = Object.keys(this.StrengthenConfig);

        const selectStats = this.getRandomStats(availableStats, 4);

        for (const stats of selectStats) {

            const config = this.StrengthenConfig[stats];

            // 随机等级
            const randomLevel = Math.floor(Math.random() * 3) + 1;

            const modifier = config.modifiers.find(mod => mod.level === randomLevel.toString());

            results.push({
                name: config.name,
                stats: stats as keyof ActorStats,
                modifier: modifier,
                description: config.description.replace('{value}', modifier.value.toString())
            })
        }

        Debug.Log(Tag, "随机属性", results);

        return results;
    }

    private getRandomStats(array: string[], count: number): string[] {
        const shuffled = array.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
}