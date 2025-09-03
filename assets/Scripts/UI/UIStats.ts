import { _decorator, Component, Label, Node } from 'cc';
import { UIBase } from '../Base/UIBase';
import { ActorStats } from '../Entity/Actor/ActorStats';
import { Debug } from '../Util';
const { ccclass, property } = _decorator;

@ccclass('UIStats')
export class UIStats extends UIBase {
    
    private Layout: Node;


    public open(stats: ActorStats): void {
        if (!this.Layout) {
            this.Layout = this.node.getChildByName('Layout');
            Debug.Log('UIStats Layout', this.Layout);
        }

        for (let i = 0; i < this.Layout.children.length; i++) {
            const statNode = this.Layout.children[i];
            const statName = statNode.name;
            if (!(statName in stats)) continue;
            const statValue = stats[statName] as number;
            const valueLabel = statNode.getChildByName('value').getComponent(Label);
            valueLabel.string = statValue.toString();
        }
    }

    public close(...args: any[]): void {
        
    }
}


