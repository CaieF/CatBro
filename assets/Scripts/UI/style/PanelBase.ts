import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PanelBase')
export abstract class PanelBase extends Component {
    public abstract render(...args: any[]): void;
}


