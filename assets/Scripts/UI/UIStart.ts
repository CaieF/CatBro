import { _decorator, Component, director, Node } from 'cc';
import { UIBase } from '../Base/UIBase';
import { UIManager } from '../Global/UIManager';
import { UITypeEnum } from '../Enum';
const { ccclass, property } = _decorator;

@ccclass('UIStart')
export class UIStart extends UIBase {

    public close(...args: any[]): void {
        
    }
    /** 跳转到Battle场景 */
    private clickBtnStart() {
        // 跳转到Battle场景
        // director.loadScene("Battle");
        UIManager.Instance.closePanel(UITypeEnum.UIStart);
        UIManager.Instance.openPanel(UITypeEnum.UIHeroSelect, false);
    }

    private clickBtnExit() {
        console.log("clickBtnExit");
        // application.exit();
    }
}


