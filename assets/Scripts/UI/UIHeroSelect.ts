import { _decorator, Component, instantiate, Label, Node, Prefab, Sprite } from 'cc';
import { UIBase } from '../Base/UIBase';
import { ActorEntityTypeEnum } from '../Common';
import { UIHeroGird } from './UIHeroGird';
import { UIHeroSelectCtrl } from '../Controller/UIHeroSelectCtrl';
import { IActorConfig } from '../Factory/ActorFactory';
import DataManager from '../Global/DataManager';
import { PanelSelectHero } from './style/PanelSelectHero';
const { ccclass, property } = _decorator;

@ccclass('UIHeroSelect')
export class UIHeroSelect extends UIBase {

    @property({ type: Node, tooltip: '角色选择列表' })
    private heroList: Node = null;

    @property({ type: Prefab, tooltip: 'ui角色选择项预制体' })
    private uiHeroGridPrefab: Prefab = null;

    @property({ type: PanelSelectHero, tooltip: '选择角色面板' })
    private panelSelectHero: PanelSelectHero = null

    private controller: UIHeroSelectCtrl = null;

    public init(...args: any[]): void {
        super.init()
        this.controller = new UIHeroSelectCtrl(this);
        this.heroList.removeAllChildren();
        for (const key in ActorEntityTypeEnum) {
            const actorType = ActorEntityTypeEnum[key];
            const uiHeroGrid = instantiate(this.uiHeroGridPrefab);
            uiHeroGrid.parent = this.heroList;
            uiHeroGrid.getComponent(UIHeroGird).open(actorType, this.controller);
        }
    }

    public open(...args: any[]): void {
        super.open(...args);
    }

    public close(...args: any[]): void {
        
    }

    /**
     * 展示选择的英雄信息
     * @param actorType 角色类型
     * @param actorConfig 角色配置
     */
    public showSelectHeroInfo(actorType: ActorEntityTypeEnum, actorConfig: IActorConfig) {
        this.panelSelectHero.render(actorType, actorConfig);
    }

    /** 点击返回 */
    private clickBtnBack() {
        this.controller.back();
    }
}


