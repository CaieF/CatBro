import Singleton from "../Base/Singleton";
import { ConfigTypeEnum, PropTypeEnum } from "../Common";
import DataManager from "../Global/DataManager";
import { IModifier } from "./ActorFactory";

/**
 * 道具配置
 */
export interface IPropConfig {
    name: string;
    modifers: IModifier[];
}

/**
 * 道具工厂
 */
export class PropFactory extends Singleton {
    private PropConfig: Record<string, IPropConfig>;

    public static get Instance() {
        return super.GetInstance<PropFactory>();
    }

    public init(): void {
        const config = DataManager.Instance.configMap.get(ConfigTypeEnum.PropConfig).json;
        this.PropConfig = config as Record<PropTypeEnum, IPropConfig>;
    }

    public getPropConfig(propType: PropTypeEnum): IPropConfig {
        return this.PropConfig[propType];
    }
}