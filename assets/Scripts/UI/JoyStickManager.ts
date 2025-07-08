import { _decorator, Component, EventTouch, Input, input, Node, UITransform, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JoyStickManager')
export class JoyStickManager extends Component {

    public input: Vec2 = Vec2.ZERO;    // 摇杆输入值
    
    private body: Node;
    private stick: Node;
    private defaultPos: Vec2;   // 默认位置
    private radius: number;     // 摇杆半径

    protected onLoad(): void {
        this.body = this.node.getChildByName('Body');
        this.stick = this.body.getChildByName('Stick');
        this.radius = this.body.getComponent(UITransform).contentSize.x / 2;
        this.defaultPos = new Vec2(this.body.position.x, this.body.position.y);

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }
    
    private onTouchStart(event: EventTouch): void {
        const touchPos = event.getUILocation();
        this.body.setPosition(touchPos.x, touchPos.y);
    }

    private onTouchMove(event: EventTouch): void {
        const touchPos = event.getUILocation();
        const stickPos = new Vec2(touchPos.x - this.body.position.x, touchPos.y - this.body.position.y)
        
        // 限制摇杆范围在半径范围
        if (stickPos.length() > this.radius) {
            stickPos.multiplyScalar(this.radius / stickPos.length());
        }

        this.stick.setPosition(stickPos.x, stickPos.y);

        this.input = stickPos.clone().normalize();   // 记录输入值
    }

    private onTouchEnd(event: EventTouch): void {
        this.body.setPosition(this.defaultPos.x, this.defaultPos.y);
        this.stick.setPosition(0, 0);

        this.input = Vec2.ZERO;   // 重置输入值
    }
}


