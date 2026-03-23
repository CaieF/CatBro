import { _decorator, Component, director, Event, Label, Node, Sprite } from 'cc';
import { UIBase } from '../Base/UIBase';
import { IStrengthenResult } from '../Factory/StrengthenFactory';
import DataManager from '../Global/DataManager';
import { ActorManager } from '../Entity/Actor/ActorManager';
import { ActorStatModifier } from '../Entity/Actor/Modifier';
import { UIManager } from '../Global/UIManager';
import { ActorStatsEnum, EventEnum, UITypeEnum } from '../Enum';
import EventManager from '../Global/EventManager';
const { ccclass, property } = _decorator;

@ccclass('UIStrengthen')
export class UIStrengthen extends UIBase {
    
    private strengthen: IStrengthenResult;

    public init(...args: any[]): void {

    }

    public open(strengthen: IStrengthenResult): void {
        super.open(strengthen);
        this.strengthen = strengthen;
        this.node.getChildByName('icon').getComponent(Sprite).spriteFrame = DataManager.Instance.textureMap.get(strengthen.stats)[0];
        this.node.getChildByName('name').getComponent(Label).string = strengthen.name;
        this.node.getChildByName('description').getComponent(Label).string = strengthen.description;
    }

    public close(...args: any[]): void {
        
    }

    private clickAddModifier(event: Event) {
        const modifier = new ActorStatModifier(this.strengthen.stats as ActorStatsEnum, this.strengthen.modifier.value);
        let actor = DataManager.Instance.myPlayer.getComponent(ActorManager);
        actor.stats.addStrengthenModifier(modifier);
        if (this.strengthen.stats === ActorStatsEnum.MaxHealth) {
            EventManager.Instance.emit(EventEnum.UIHPUpdate, actor.stats.currentHealth, actor.stats.get(ActorStatsEnum.MaxHealth));
        }
        UIManager.Instance.closePanel(UITypeEnum.UILevelUp);
        // director.resume();
    }
}


