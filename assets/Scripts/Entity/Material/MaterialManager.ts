import { _decorator, Component, Node, Sprite } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import { IActor, IMaterial, InputTypeEnum, MaterialTypeEnum } from '../../Common';
import DataManager from '../../Global/DataManager';
import { ObjectPoolManager } from '../../Global/ObjectPoolManager';
const { ccclass, property } = _decorator;

@ccclass('MaterialManager')
export class MaterialManager extends EntityManager {
    private id: number;
    private type: MaterialTypeEnum;
    private target: IActor;

    public init(data: IMaterial): void {
        this.id = data.id;
        this.type = data.type;
        this.target = null;

        this.node.getComponent(Sprite).spriteFrame = DataManager.Instance.textureMap.get(this.type)[0];
        this.node.active = false;
    }

    public recyle() {

    }

    public render(data: IMaterial): void {
        const { position } = data;
        this.node.active = true;
        this.node.setPosition(position.x, position.y);
    }

    public tick(dt: number): void {
        if (!this.node.active) return;

        this.findActor();
        this.setDir(dt);
    }

    private findActor(): void {
        for (const data of DataManager.Instance.state.actors) {
            const distannce = Math.sqrt(Math.pow(data.position.x - this.node.position.x, 2) + Math.pow(data.position.y - this.node.position.y, 2));
            if (distannce < 150) {
                this.target = data;
            }
        }
    }

    private setDir(dt: number): void {
        if (!this.target) return;
        const dirX = this.target.position.x - this.node.position.x;
        const dirY = this.target.position.y - this.node.position.y;
        const distance = Math.sqrt(Math.pow(dirX, 2) + Math.pow(dirY, 2));
        // const distance = Math.sqrt(Math.pow(this.target.position.x - this.node.position.x, 2) + Math.pow(this.target.position.y - this.node.position.y, 2));

        if (distance < 50) {
            ObjectPoolManager.Instance.ret(this.node);
            DataManager.Instance.materialCollected(this.id);
            this.recyle();
            return;
        }

        DataManager.Instance.applyInput({
            id: this.id,
            type: InputTypeEnum.MaterialMove,
            direction: { x: dirX / distance, y: dirY / distance },
            dt,
        })
    }
}


