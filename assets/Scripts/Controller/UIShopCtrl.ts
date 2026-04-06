import { PropTypeEnum, WeaponEntityTypeEnum } from "../Common";
import DataManager from "../Global/DataManager";
import { UIShop } from "../UI/UIShop";

export class UIShopCtrl {
    private uiShop: UIShop = null;

    constructor(uiShop: UIShop) {
        this.uiShop = uiShop;
    }

    public buyWeapon(weaponType: WeaponEntityTypeEnum) {
        // DataManager.Instance.myWeaponType = weaponType;
        DataManager.Instance.myWeaponList.push(weaponType);
        // TODO
        // EventManager.Instance.emit(EventEnum.GameStart);
    }

    public buyProp(propType: PropTypeEnum) {
        
    }
}