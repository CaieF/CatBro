import { _decorator, Component, Label, Node } from 'cc';
import { UIBase } from '../Base/UIBase';
import { ActorStats } from '../Entity/Actor/ActorStats';
import { Debug } from '../Util';
import { ActorStatsEnum } from '../Enum';
const { ccclass, property } = _decorator;

@ccclass('UIStats')
export class UIStats extends UIBase {
    
    private Layout: Node = null;

    public init(...args: any[]): void {
        super.init();
        this.Layout = this.node.getChildByName('Layout');
    }


    public open(stats: ActorStats): void {
        super.open();
        this.renderStats(stats);
    }

    public close(...args: any[]): void {
        
    }

    renderStats(stats: ActorStats): void {
        const currentLevel = stats.currentLevel;
        const levelValueLabel = this.Layout.children[0].getChildByName('value').getComponent(Label);
        levelValueLabel.string = currentLevel.toString();

        for (let i = 1; i < this.Layout.children.length; i++) {
            const statNode = this.Layout.children[i];
            const statName = statNode.name;
            // Debug.Log('UIStats statName', statName);
            const statValue = stats.get(statName as ActorStatsEnum);
            const valueLabel = statNode.getChildByName('value').getComponent(Label);
            valueLabel.string = statValue.toString();
        }
    }
}


