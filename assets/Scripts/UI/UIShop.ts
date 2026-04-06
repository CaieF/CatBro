import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { UIBase } from '../Base/UIBase';
import DataManager from '../Global/DataManager';
import { ActorManager } from '../Entity/Actor/ActorManager';
import EventManager from '../Global/EventManager';
import { EventEnum } from '../Enum';
import { UIGoodItem } from './UIGoodItem';
import { PropTypeEnum, WeaponEntityTypeEnum } from '../Common';
import { UIShopCtrl } from '../Controller/UIShopCtrl';
// import { EventEnum } from '../Event/EventEnum';
const { ccclass, property } = _decorator;

@ccclass('UIShop')
export class UIShop extends UIBase {
    
    @property(Node)
    private usStats: Node;

    @property(Node)
    private layout: Node;

    private controller: UIShopCtrl = null;

    public init(...args: any[]): void {
        super.init();
        this.controller = new UIShopCtrl(this);
    }

    public open(...args: any[]): void {
        super.open();
        this.refreshGoods();
    }

    clickBtnRefresh(): void {
        const am = DataManager.Instance.myPlayer.getComponent(ActorManager);
        if (am.money < 2) {
            return;
        }
        am.money -= 2;
        EventManager.Instance.emit(EventEnum.UIMoneyUpdate, am.money);
        this.refreshGoods();
    }

    /** 刷新商品 */
    private refreshGoods(): void {
        // for (let i = 0; i < this.)
        // this.layout.removeAllChildren();
        for (let i = 0; i < 2; i++) {
            let item = this.layout.children[i]
            item.parent = this.layout;
            item.getComponent(UIGoodItem).open(PropTypeEnum.Prop01, this.controller);
        }
        for (let i = 0; i < 2; i++) {
            let item = this.layout.children[i + 2];
            item.parent = this.layout;
            item.getComponent(UIGoodItem).open(WeaponEntityTypeEnum.Weapon01, this.controller);
        }
    }
}


