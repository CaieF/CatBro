import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { UIBase } from '../Base/UIBase';
import { PanelSelectHero } from './style/PanelSelectHero';
import { ActorEntityTypeEnum, WeaponEntityTypeEnum } from '../Common';
import { IActorConfig } from '../Factory/ActorFactory';
import { IWeaponConfig } from '../Factory/WeaponFactory';
import { PanelWeaponInfo } from './style/PanelWeaponInfo';
import { UIWeaponSelectCtrl } from '../Controller/UIWeaponSelectCtrl';
import { UIWeaponGrid } from './UIWeaponGrid';
const { ccclass, property } = _decorator;

@ccclass('UIWeaponSelect')
export class UIWeaponSelect extends UIBase {

    @property({ type: Node, tooltip: '武器选择列表' })
    private weaponList: Node = null;

    @property({ type: Prefab, tooltip: 'ui武器选择项预制体' })
    private uiWeaponGridPrefab: Prefab = null;

    @property({ type: PanelSelectHero, tooltip: '选择角色面板' })
    private panelSelectHero: PanelSelectHero = null;

    @property({ type: PanelWeaponInfo, tooltip: '武器信息面板' })
    private panelWeaponInfo: PanelWeaponInfo = null;

    private controller: UIWeaponSelectCtrl = null;
    
    public init(...args: any[]): void {
        super.init()
        this.controller = new UIWeaponSelectCtrl(this);
    }

    public open(actorType: ActorEntityTypeEnum, actorConfig: IActorConfig): void {
        super.open(actorType, actorConfig);
        this.panelSelectHero.render(actorType, actorConfig);
        // 展示武器选择列表
        this.weaponList.removeAllChildren();
        for (const key in WeaponEntityTypeEnum) {
            const weaponType = WeaponEntityTypeEnum[key];
            const uiWeaponGrid = instantiate(this.uiWeaponGridPrefab);
            uiWeaponGrid.parent = this.weaponList;
            uiWeaponGrid.getComponent(UIWeaponGrid).open(weaponType, this.controller);
        }
    }
    
    /** 展示武器选择信息 */
    public showSelectWeaponInfo(weaponType: WeaponEntityTypeEnum, weaponConfig: IWeaponConfig) {
        this.panelWeaponInfo.render(weaponType, weaponConfig);
    }



    /** 点击返回 */
    private clickBtnBack() {
        this.controller.back();
    }
}


