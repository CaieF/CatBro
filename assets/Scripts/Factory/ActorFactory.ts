import Singleton from "../Base/Singleton";
import { ActorEntityTypeEnum, ConfigTypeEnum } from "../Common";
import { ActorStats } from "../Entity/Actor/ActorStats";
import { IActorModifier } from "../Entity/Actor/IActorModifier";
import { ModifierTypeEnum } from "../Enum";
import DataManager from "../Global/DataManager";
import { Debug } from "../Util";

interface IChanges {
    
}

export interface IModifier {
    type: ModifierTypeEnum;
    // changes: IChanges;
    stat: keyof ActorStats;
    value: number;
}

export interface IActorConfig {
    name: string;
    modifiers: IModifier[];
}

const Tag = 'ActorFactory';
/**
 * 角色工厂
 */
export class ActorFactory extends Singleton {
    private ActorConfig: Record<ActorEntityTypeEnum, IActorConfig>;

    public static get Instance() {
        return super.GetInstance<ActorFactory>();
    }

    public init(): void {
        const config = DataManager.Instance.configMap.get(ConfigTypeEnum.ActorConfig).json;
        // Debug.Log(Tag, config)
        this.ActorConfig = config as Record<ActorEntityTypeEnum, IActorConfig>;
        Debug.Log(Tag, "角色配置加载", this.ActorConfig);
    }

    /**
     * 创建角色属性
     * @param actorType 角色类型
     * @returns 
     */
    public createActorStas(actorType: ActorEntityTypeEnum): ActorStats {
        const config = this.ActorConfig[actorType];

        const stats = new ActorStats(config.modifiers);
        Debug.Log(Tag, "创建角色", actorType, stats);
        return stats;
    }

}