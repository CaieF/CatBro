import { _decorator, Component, director, Node } from 'cc';
import { UIBase } from '../Base/UIBase';
import DataManager from '../Global/DataManager';
import { EventEnum, UITypeEnum } from '../Enum';
import { UIManager } from '../Global/UIManager';
import EventManager from '../Global/EventManager';
const { ccclass, property } = _decorator;

@ccclass('UIOver')
export class UIOver extends UIBase {
    public init(...args: any[]): void {
    }

    public open(...args: any[]): void {
        super.open(...args);
    }

    public close(...args: any[]): void {
        
    }

    private clickBtnRestart() {
        // DataManager.Instance.restart();
        EventManager.Instance.emit(EventEnum.GameOver);
        EventManager.Instance.emit(EventEnum.GameStart);
        UIManager.Instance.closePanel(UITypeEnum.UIOver);
        // director.loadScene('Battle');
    }

    private clickBtnBack() {
        // DataManager.Instance.restart();
        EventManager.Instance.emit(EventEnum.GameOver);
        UIManager.Instance.closePanel(UITypeEnum.UIOver);
        UIManager.Instance.openPanel(UITypeEnum.UIHeroSelect);
        // director.loadScene('Start');
    }
}


