import { _decorator, Component, Node, Sprite, toDegree } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import { BulletTypeEnum, IBullet } from '../../Common';
import DataManager from '../../Global/DataManager';
import { rad2Angle } from '../../Util';
import EventManager from '../../Global/EventManager';
import { EventEnum } from '../../Enum';
import { ObjectPoolManager } from '../../Global/ObjectPoolManager';
const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends EntityManager {
    
    public type: BulletTypeEnum;
    private id: number;

    public init(data: IBullet): void {
        this.id = data.id;
        this.type = data.type;
        
        this.node.getComponent(Sprite).spriteFrame = DataManager.Instance.textureMap.get(this.type)[0];
        this.node.active = false;

        EventManager.Instance.on(EventEnum.BulletDestory, this.handleBullerDestory, this);
    }

    public recyle() {
        EventManager.Instance.off(EventEnum.BulletDestory, this.handleBullerDestory, this);
    }

    public render(data: IBullet): void {
        const { direction, position } = data;
        this.node.active = true;

        this.node.setPosition(position.x, position.y);
        const side = Math.sqrt(direction.x ** 2 + direction.y ** 2);
        const angle = direction.x > 0 ? rad2Angle(Math.asin(direction.y / side)) : rad2Angle(Math.asin(-direction.y / side)) + 180;
        this.node.setRotationFromEuler(0, 0, angle);
    }

    private handleBullerDestory(id: number) {
        if (id !== this.id) return;

        DataManager.Instance.bulletMap.delete(this.id);
        this.recyle();
        ObjectPoolManager.Instance.ret(this.node);
    }


}


