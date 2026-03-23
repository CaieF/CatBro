import { _decorator, Component, director, Node, UI } from 'cc';
import { UIBase } from '../Base/UIBase';
import { UIStats } from './UIStats';
import { ActorStats } from '../Entity/Actor/ActorStats';
import { UIManager } from '../Global/UIManager';
import { EventEnum, UITypeEnum } from '../Enum';
import { IStrengthenResult, StrengthenFactory } from '../Factory/StrengthenFactory';
import { UIStrengthen } from './UIStrengthen';
import DataManager from '../Global/DataManager';
import { ActorManager } from '../Entity/Actor/ActorManager';
import EventManager from '../Global/EventManager';
const { ccclass, property } = _decorator;

@ccclass('UILevelUp')
export class UILevelUp extends UIBase {
    
    @property(Node)
    private uiStats: Node;

    @property(Node)
    private layout: Node;

    private strengthenOptions: IStrengthenResult[];


    public open(stats: ActorStats): void {
        super.open()
        director.pause();
        this.refreshOptions();

        this.uiStats.getComponent(UIStats).open(stats);
    }

    public close(): void {
        director.resume();
        this.uiStats.getComponent(UIStats).close();
    }

    private clickRefresh(): void {
        // UIManager.Instance.closePanel(UITypeEnum.UILevelUp)
        const am = DataManager.Instance.myPlayer.getComponent(ActorManager);
        if (am.money < 2) {
            return;
        }

        am.money -= 2;
        EventManager.Instance.emit(EventEnum.UIMoneyUpdate, am.money);
        this.refreshOptions();
    }

    /** 刷新强化选项 */
    private refreshOptions(): void {
        this.strengthenOptions = StrengthenFactory.Instance.createStrengthen();

        for (let i = 0; i < this.strengthenOptions.length; i++) {
            let uiStrengthen = this.layout.children[i];
            uiStrengthen.getComponent(UIStrengthen).open(this.strengthenOptions[i]);
        }
    }
}


