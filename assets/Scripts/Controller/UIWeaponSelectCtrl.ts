import { ActorEntityTypeEnum, WeaponEntityTypeEnum } from "../Common";
import { EventEnum, UITypeEnum } from "../Enum";
import { IActorConfig } from "../Factory/ActorFactory";
import { IWeaponConfig } from "../Factory/WeaponFactory";
import DataManager from "../Global/DataManager";
import EventManager from "../Global/EventManager";
import { UIManager } from "../Global/UIManager";
import { UIHeroSelect } from "../UI/UIHeroSelect";
import { UIWeaponSelect } from "../UI/UIWeaponSelect";

export class UIWeaponSelectCtrl {
    private uiWeaponSelect: UIWeaponSelect = null;
    
    constructor(uiWeaponSelect: UIWeaponSelect) {
        this.uiWeaponSelect = uiWeaponSelect;
    }

    /** 选择角色 */
    // public selectHero(actorType: IA) {
    //     Debug.Log(`selectHero`, actorType);
    // }
    public hoverWeapon(weaponType: WeaponEntityTypeEnum, weaponConfig: IWeaponConfig) {
        this.uiWeaponSelect.showSelectWeaponInfo(weaponType, weaponConfig);
    }

    public selectWeapon(weaponType: WeaponEntityTypeEnum) {
        // DataManager.Instance.myWeaponType = weaponType;
        DataManager.Instance.myWeaponList.push(weaponType);
        // TODO
        // EventManager.Instance.emit(EventEnum.GameStart);
        UIManager.Instance.closePanel(UITypeEnum.UIWeaponSelect);
        UIManager.Instance.openPanel(UITypeEnum.UIShop);
    }

    public back() {
        UIManager.Instance.closePanel(UITypeEnum.UIWeaponSelect);
        UIManager.Instance.openPanel(UITypeEnum.UIHeroSelect);
        // DataManager.Instance.myWeaponList.pop();
    }
}