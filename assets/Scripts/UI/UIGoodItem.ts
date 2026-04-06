import { _decorator, Component, Label, math, Node } from 'cc';
import { UIBase } from '../Base/UIBase';
import { PropTypeEnum, WeaponEntityTypeEnum } from '../Common';
import { PanelBase } from './style/PanelBase';
import { PanelWeaponInfo } from './style/PanelWeaponInfo';
import { PanelPropInfo } from './style/PanelPropInfo';
import { IWeaponConfig, WeaponFactory } from '../Factory/WeaponFactory';
import { IPropConfig, PropFactory } from '../Factory/PropFactory';
import { UIShopCtrl } from '../Controller/UIShopCtrl';
import DataManager from '../Global/DataManager';
import { ActorManager } from '../Entity/Actor/ActorManager';
import { Debug } from '../Util';
import EventManager from '../Global/EventManager';
import { EventEnum } from '../Enum';
const { ccclass, property } = _decorator;

@ccclass('UIGoodItem')
export class UIGoodItem extends UIBase {

    private goodType: WeaponEntityTypeEnum | PropTypeEnum;

    @property(PanelWeaponInfo)
    private panelBaseWeaponInfo: PanelWeaponInfo = null;

    @property(PanelPropInfo)
    private panelBasePropInfo: PanelPropInfo = null;

    @property({type: Label, tooltip: '价格'})
    private label_price: Label = null;

    private goodConfig: IWeaponConfig | IPropConfig;

    private controller: UIShopCtrl = null;

    private price: number = 0;
    
    public open(goodType: WeaponEntityTypeEnum | PropTypeEnum, controller: UIShopCtrl): void {
        this.controller = controller;
        this.refreshGoodInfo(goodType);
    }

    private refreshGoodInfo(goodType: WeaponEntityTypeEnum | PropTypeEnum) {
        this.goodType = goodType;
        this.price = math.randomRangeInt(10, 15);
        this.label_price.string = this.price.toString();

        // 判断商品是武器还是道具
        if (goodType.startsWith('Weapon')) {
            // 武器
            this.goodConfig = WeaponFactory.Instance.getWeaponConfig(goodType as WeaponEntityTypeEnum);
            Debug.Log('这是武器:', goodType);
            this.panelBaseWeaponInfo.render(this.goodType as WeaponEntityTypeEnum, this.goodConfig);
        } else if (goodType.startsWith('Prop')) {
            // 道具
            this.goodConfig = PropFactory.Instance.getPropConfig(goodType as PropTypeEnum);
            this.panelBasePropInfo.render(this.goodType as PropTypeEnum, this.goodConfig);
            Debug.Log('这是道具:', goodType);
        }
    }

    clickBtnBuy() {
        console.log(`clickBtnBuy`, this.goodType);
        // for (let i = 0; i <)
        const am = DataManager.Instance.myPlayer.getComponent(ActorManager);
        if (am.money < this.price) {
            Debug.Log('没有足够的钱');
            return;
        }
        am.money -= this.price;
        EventManager.Instance.emit(EventEnum.UIMoneyUpdate, am.money);
        if (this.goodType.startsWith('Weapon')) {
            this.controller.buyWeapon(this.goodType as WeaponEntityTypeEnum);
        } else if (this.goodType.startsWith('Prop')) {
            this.controller.buyProp(this.goodType as PropTypeEnum);
        }
        this.refreshGoodInfo(WeaponEntityTypeEnum.Weapon02);
    }
}


