import { _decorator, Component, director, Node, UI } from 'cc';
import { UIBase } from '../Base/UIBase';
import { UIStats } from './UIStats';
import { ActorStats } from '../Entity/Actor/ActorStats';
import { UIManager } from '../Global/UIManager';
import { UITypeEnum } from '../Enum';
import { IStrengthenResult, StrengthenFactory } from '../Factory/StrengthenFactory';
import { UIStrengthen } from './UIStrengthen';
const { ccclass, property } = _decorator;

@ccclass('UILevelUp')
export class UILevelUp extends UIBase {
    
    private uiStats: Node;
    private layout: Node;
    private strengthenOptions: IStrengthenResult[];

    // public init(actorStats: ActorStats): void {
    //     this.uiStats = this.node.getChildByName('UIStats');
    //     this.uiStats.getComponent(UIStats).init(actorStats);
    // }

    public open(stats: ActorStats): void {
        director.pause();
        if (!this.uiStats) {
            this.uiStats = this.node.getChildByName('UIStats');
        }

        if (!this.layout) {
            this.layout = this.node.getChildByName('Layout');
        }

        this.refreshOptions();

        this.uiStats.getComponent(UIStats).open(stats);
    }

    public close(): void {
        director.resume();
        this.uiStats.getComponent(UIStats).close();
    }

    private clickRefresh(): void {
        // UIManager.Instance.closePanel(UITypeEnum.UILevelUp)
        this.refreshOptions();
    }

    private refreshOptions(): void {
        this.strengthenOptions = StrengthenFactory.Instance.createLevel();

        for (let i = 0; i < this.strengthenOptions.length; i++) {
            let uiStrengthen = this.layout.children[i];
            uiStrengthen.getComponent(UIStrengthen).open(this.strengthenOptions[i]);
        }
    }
}


