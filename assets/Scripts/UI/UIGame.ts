import { _decorator, Component, Label, Node, ProgressBar } from 'cc';
import EventManager from '../Global/EventManager';
import { EventEnum } from '../Enum';
const { ccclass, property } = _decorator;

@ccclass('UIGame')
export class UIGame extends Component {
    private actorMessage: Node;

    private hpBar: Node;
    private expBar: Node
    private money: Node;

    protected onLoad(): void {
        this.actorMessage = this.node.getChildByName('ActorMessage');

        this.hpBar = this.actorMessage.getChildByName('HpBar');
        this.expBar = this.actorMessage.getChildByName('ExpBar');
        this.money = this.actorMessage.getChildByName('Money');

        EventManager.Instance.on(EventEnum.UIHPUpdate, this.handleHpUpdate, this);
        EventManager.Instance.on(EventEnum.UIEXPUpdate, this.updateExp, this);
        EventManager.Instance.on(EventEnum.UIMoneyUpdate, this.updateMoney, this);
    }

    protected onDestroy(): void {
        EventManager.Instance.off(EventEnum.UIHPUpdate, this.handleHpUpdate, this);
        EventManager.Instance.off(EventEnum.UIEXPUpdate, this.updateExp, this);
        EventManager.Instance.off(EventEnum.UIMoneyUpdate, this.updateMoney, this);
    }

    private handleHpUpdate(hp: number, maxHp: number): void {
        this.hpBar.getComponent(ProgressBar).progress = hp / maxHp;
        this.hpBar.getComponentInChildren(Label).string = `${hp}/${maxHp}`;
    }

    private updateExp(exp: number, maxExp: number,level: number): void {
        this.expBar.getComponent(ProgressBar).progress = exp / maxExp;
        this.expBar.getComponentInChildren(Label).string = `Lv.${level}`;

    }

    private updateMoney(money: number): void {
        this.money.getComponentInChildren(Label).string = money.toString();
    }
}


