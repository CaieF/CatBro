import { _decorator, Component, Node, Sprite } from 'cc';
import { UIBase } from '../Base/UIBase';
import { ActorFactory, IActorConfig } from '../Factory/ActorFactory';
import { ActorEntityTypeEnum } from '../Common';
import DataManager from '../Global/DataManager';
import { UIHeroSelectCtrl } from '../Controller/UIHeroSelectCtrl';
import { Debug } from '../Util';
const { ccclass, property } = _decorator;

@ccclass('UIHeroGird')
export class UIHeroGird extends UIBase {

    /** 角色类型 */
    private actorType: ActorEntityTypeEnum;
    /** 角色配置信息 */
    private actorConfig: IActorConfig;

    /** 控制器 */
    private controller: UIHeroSelectCtrl = null;

    @property({ type: Sprite, tooltip: '角色头像' })
    private pic_avatar: Sprite = null;

    @property({ type: Node, tooltip: '选择框的节点' })
    private node_select: Node = null;


    public init(actorType: ActorEntityTypeEnum, controller: UIHeroSelectCtrl): void {
        super.init();
        this.controller = controller;
        this.actorType = actorType;
        this.actorConfig = ActorFactory.Instance.getActorConfig(actorType);
        this.pic_avatar.spriteFrame = DataManager.Instance.textureMap.get(actorType)[0];

        this.node.on(Node.EventType.TOUCH_START, this.onHoverHero, this);

        this.node.on(Node.EventType.MOUSE_ENTER, this.onHoverHero, this);

        this.node.on(Node.EventType.MOUSE_LEAVE, this.onLeaveHero, this);

        this.node.on(Node.EventType.TOUCH_CANCEL, this.onLeaveHero, this)

        this.node.on(Node.EventType.TOUCH_END, this.onSelectHero, this);
    }

    public open(actorType: ActorEntityTypeEnum, controller: UIHeroSelectCtrl): void {
        super.open(actorType, controller);
        this.node_select.active = false;
    }

    public close(...args: any[]): void {
        
    }

    /** 鼠标悬停事件 */
    private onHoverHero() {
        this.controller.hoverHero(this.actorType, this.actorConfig);
        this.node_select.active = true;
    }

    private onLeaveHero() {
        this.node_select.active = false;
    }

    /** 点击事件 */
    private onSelectHero() {
        this.controller.selectHero(this.actorType);
    }
}


