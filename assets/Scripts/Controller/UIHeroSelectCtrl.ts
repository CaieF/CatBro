import { ActorEntityTypeEnum } from "../Common";
import { EventEnum, UITypeEnum } from "../Enum";
import { IActorConfig } from "../Factory/ActorFactory";
import DataManager from "../Global/DataManager";
import EventManager from "../Global/EventManager";
import { UIManager } from "../Global/UIManager";
import { UIHeroSelect } from "../UI/UIHeroSelect";

export class UIHeroSelectCtrl {
    private uiHeroSelect: UIHeroSelect = null;
    
    constructor(uiHeroSelect: UIHeroSelect) {
        this.uiHeroSelect = uiHeroSelect;
    }

    /** 选择角色 */
    // public selectHero(actorType: IA) {
    //     Debug.Log(`selectHero`, actorType);
    // }
    public hoverHero(actorType: ActorEntityTypeEnum, actorConfig: IActorConfig) {
        this.uiHeroSelect.showSelectHeroInfo(actorType, actorConfig);
    }

    public selectHero(actorType: ActorEntityTypeEnum) {
        DataManager.Instance.myPlayerType = actorType;
        EventManager.Instance.emit(EventEnum.GameStart);
        UIManager.Instance.closePanel(UITypeEnum.UIHeroSelect);
    }

    public back() {
        UIManager.Instance.closePanel(UITypeEnum.UIHeroSelect);
        UIManager.Instance.openPanel(UITypeEnum.UIStart);
    }
}