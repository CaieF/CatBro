import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIBase')
export abstract class UIBase extends Component {
    
    // public abstract init(...args: any[]): void;

    public abstract open(...args: any[]): void;

    public abstract close(...args: any[]): void;
}


