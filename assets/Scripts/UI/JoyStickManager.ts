import { _decorator, Component, EventKeyboard, EventTouch, Input, input, KeyCode, Node, UITransform, Vec2 } from 'cc';
import { Debug } from '../Util';
const { ccclass, property } = _decorator;

const Tag = 'JoyStickManager';
/**
 * 摇杆管理类
 * 负责摇杆的输入
 */
@ccclass('JoyStickManager')
export class JoyStickManager extends Component {

    public input: Vec2 = Vec2.ZERO;    // 摇杆输入值
    
    private body: Node;
    private stick: Node;
    private defaultPos: Vec2;   // 默认位置
    private radius: number;     // 摇杆半径

    private keyPressed: Record<string, boolean> = {};

    protected onLoad(): void {
        this.body = this.node.getChildByName('Body');
        this.stick = this.body.getChildByName('Stick');
        this.radius = this.body.getComponent(UITransform).contentSize.x / 2;
        this.defaultPos = new Vec2(this.body.position.x, this.body.position.y);

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);

        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
    
    //#region 触摸输入相关处理
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
    //#endregion

    //#region 键盘输入相关处理
    private onKeyDown(event: EventKeyboard): void {
        const keyCode = event.keyCode;
        const keyName = this.getKeyName(keyCode);
        if (keyName) {
            this.keyPressed[keyName] = true;   // 记录按键状态
            this.updateStickByKeyboard();       // 更新摇杆位置
        }
    }

    private onKeyUp(event: EventKeyboard): void {
        const keyCode = event.keyCode;
        const keyName = this.getKeyName(keyCode);
        if (keyName) {
            this.keyPressed[keyName] = false;  // 记录按键状态
            this.updateStickByKeyboard();       // 更新摇杆位置
        }
    }

    /**
     * 获取按键名称
     * @param keyCode 键码
     */
    private getKeyName(keyCode: number): string | null {
        switch (keyCode) {
            case KeyCode.KEY_W:
                return 'W';
            case KeyCode.KEY_A:
                return 'A';
            case KeyCode.KEY_S:
                return 'S';
            case KeyCode.KEY_D:
                return 'D';
            default:
                return null;
        }
    }

    private updateStickByKeyboard(): void {
        this.body.setPosition(this.defaultPos.x, this.defaultPos.y);    // 重置摇杆位置
        let dir = new Vec2(0, 0);
        if (this.keyPressed['W']) dir.y += 1;
        if (this.keyPressed['A']) dir.x -= 1;
        if (this.keyPressed['S']) dir.y -= 1;
        if (this.keyPressed['D']) dir.x += 1;

        if (dir.lengthSqr() > 0) {
            const stickPos = dir.multiplyScalar(this.radius / dir.length());
            this.stick.setPosition(stickPos.x, stickPos.y);
            this.input = dir.clone().normalize();
            Debug.Log(Tag, 'Keyboard input:', this.input.x, this.input.y);
        } else {
            this.stick.setPosition(0, 0);
            this.input = Vec2.ZERO;
        }
    }
    //#endregion
}


