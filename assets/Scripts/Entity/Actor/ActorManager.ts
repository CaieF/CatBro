import { _decorator, animation, Animation, AnimationClip, Component, Node, Sprite, Vec2 } from 'cc';
import { AnimationTypeEnum, IActor, InputTypeEnum } from '../../Common';
import DataManager from '../../Global/DataManager';
const { ccclass, property } = _decorator;

/**
 * 实体管理类
 * 负责游戏实体的创建，更新，销毁等
 */
@ccclass('ActorManager')
export class ActorManager extends Component {
    
    private am: Animation;  // 动画组件
    private sprite: Node;  // 角色图片节点
    /**
     * 角色初始化
     */
    public init(data: IActor): void {
        this.sprite = this.node.getChildByName('Sprite');
        this.sprite.getComponent(Sprite).spriteFrame = DataManager.Instance.textureMap.get(data.type)[0];
        this.am = this.sprite.getComponent(Animation);
        if (!this.am) {
            this.am = this.sprite.addComponent(Animation);
            let clip = DataManager.Instance.animationMap.get(AnimationTypeEnum.ScaleAnimation);
            // this.am.addClip(clip);
            this.am.defaultClip = clip;
            this.am.play();
        }
    }

    /**
     * 角色渲染
     * @param data 角色数据 
     */
    public render(data: IActor): void {
        const { direction, position } = data;
        this.node.setPosition(position.x, position.y);

        if (direction.x !== 0) {
            this.node.setScale(direction.x > 0 ? 1 : -1, 1);
        }
    }

    /**
     * 角色更新 数据传给 DataManager 
     * @param dt 时间间隔
     */
    public tick(dt: number): void {
        // 如果摇杆有输入
        if (DataManager.Instance.jm.input.length()) {
            const { x, y } = DataManager.Instance.jm.input;
            // 申请输入
            DataManager.Instance.applyInput({
                id: 1,
                type: InputTypeEnum.ActorMove,
                direction: { x, y },
                dt,
            })
            // 调整播放速度
            this.am.getState(AnimationTypeEnum.ScaleAnimation).speed = 2;
        } else {
            this.am.getState(AnimationTypeEnum.ScaleAnimation).speed = 1;
        }
    }
}


