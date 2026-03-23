import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { ActorEntityTypeEnum } from '../../Common';
import { IActorConfig } from '../../Factory/ActorFactory';
import DataManager from '../../Global/DataManager';
const { ccclass, property } = _decorator;

/** 选择角色信息面板 */
@ccclass('PanelSelectHero')
export class PanelSelectHero extends Component {
    @property({ type: Label, tooltip: '选择角色名称' })
    private labelHeroName: Label = null;

    @property({ type: Label, tooltip: '选择角色描述' })
    private labelHeroDesc: Label = null;

    @property({ type: Sprite, tooltip: '选择角色头像' })
    private spriteHeroIcon: Sprite = null;

    /** 渲染 */
    public render(actorType: ActorEntityTypeEnum, actorConfig: IActorConfig) {
        this.labelHeroDesc.string = "";
        this.labelHeroName.string = actorConfig.name;
                
        for (const modifier of actorConfig.modifiers) {
            this.labelHeroDesc.string += modifier.description + "\n";
        }

        this.spriteHeroIcon.spriteFrame = DataManager.Instance.textureMap.get(actorType)[0];
    }
}


