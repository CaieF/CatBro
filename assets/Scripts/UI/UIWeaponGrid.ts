import { _decorator, Component, Node, Sprite } from 'cc';
import { UIBase } from '../Base/UIBase';
import { WeaponEntityTypeEnum } from '../Common';
import { IWeaponConfig, WeaponFactory } from '../Factory/WeaponFactory';
import DataManager from '../Global/DataManager';
import { UIWeaponSelectCtrl } from '../Controller/UIWeaponSelectCtrl';
const { ccclass, property } = _decorator;

@ccclass('UIWeaponGrid')
export class UIWeaponGrid extends UIBase {
    /** 武器类型 */
        private weaponType: WeaponEntityTypeEnum;
        /** 武器配置信息 */
        private weaponConfig: IWeaponConfig;
    
        /** 控制器 */
        private controllerl: UIWeaponSelectCtrl = null;
    
        @property({ type: Sprite, tooltip: '武器图标' })
        private pic_icon: Sprite = null;
    
        @property({ type: Node, tooltip: '选择框的节点' })
        private node_select: Node = null;
    
    
        public init(weaponType: WeaponEntityTypeEnum, controller: UIWeaponSelectCtrl): void {
            super.init();
            this.controllerl = controller;
            this.weaponType = weaponType;
            this.weaponConfig = WeaponFactory.Instance.getWeaponConfig(weaponType);
            this.pic_icon.spriteFrame = DataManager.Instance.textureMap.get(weaponType)[0];
    
            this.node.on(Node.EventType.TOUCH_START, this.onHoverHero, this);
    
            this.node.on(Node.EventType.MOUSE_ENTER, this.onHoverHero, this);
    
            this.node.on(Node.EventType.MOUSE_LEAVE, this.onLeaveHero, this);
    
            this.node.on(Node.EventType.TOUCH_CANCEL, this.onLeaveHero, this)
    
            this.node.on(Node.EventType.TOUCH_END, this.onSelectHero, this);
        }
    
        public open(weaponType: WeaponEntityTypeEnum, controller: UIWeaponSelectCtrl): void {
            super.open(weaponType, controller);
            this.node_select.active = false;
        }
    
        public close(...args: any[]): void {
            
        }
    
        /** 鼠标悬停事件 */
        private onHoverHero() {
            this.controllerl.hoverWeapon(this.weaponType, this.weaponConfig);
            this.node_select.active = true;
        }
    
        private onLeaveHero() {
            this.node_select.active = false;
        }
    
        /** 点击事件 */
        private onSelectHero() {
            this.controllerl.selectWeapon(this.weaponType);
        }
}


