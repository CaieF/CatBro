import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIBase')
export abstract class UIBase extends Component {
    
    // public abstract init(...args: any[]): void;
    private isInit: boolean = false;

    public init(...args: any[]): void {
        this.isInit = true;
    }

    // public abstract open(...args: any[]): void;
    public open(...args: any[]): void {
        if (!this.isInit) {
            this.init(...args);
        }
    }

    public abstract close(...args: any[]): void;
}


