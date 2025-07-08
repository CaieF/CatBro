import { _decorator, AnimationClip, Component, instantiate, Node, Prefab, resources, SpriteFrame } from 'cc';
import DataManager from '../Global/DataManager';
import { JoyStickManager } from '../UI/JoyStickManager';
import { ActorPrefabPathEnum, AnimationPathEnum, PrefabPathEnum, TexturePathEnum } from '../Enum';
import { ResourceManager } from '../Global/ResourceManager';
import { ActorManager } from '../Entity/Actor/ActorManager';
import { EntityTypeEnum } from '../Common';
const { ccclass, property } = _decorator;

/**
 * 战斗管理类
 * 负责战斗场景的渲染和更新
 */
@ccclass('BattleManager')
export class BattleManager extends Component {
    private stage: Node;   // 舞台节点
    private ui: Node;   // UI节点

    private shouldUpdate: boolean = false;   // 是否需要更新

    protected onLoad(): void {
        DataManager.Instance.stage = this.stage = this.node.getChildByName('Stage');
        this.ui = this.node.getChildByName('UI');

        this.stage.removeAllChildren();

        DataManager.Instance.jm = this.ui.getComponentInChildren(JoyStickManager);
    }

    protected async start(): Promise<void> {
        await this.loadRes();
        this.initMap();
        this.shouldUpdate = true;
    }

    /**
     * 在update前进行资源加载
     */
    private async loadRes(): Promise<void> {
        const list = []

        // 加载预制体
        for (const type in PrefabPathEnum) {
            const p = ResourceManager.Instance.loadRes(PrefabPathEnum[type], Prefab).then((prefab) => {
                DataManager.Instance.prefabMap.set(type, prefab);
            });
            list.push(p);
        }

        // 加载图片
        for (const type in TexturePathEnum) {
            const p = ResourceManager.Instance.loadDir(TexturePathEnum[type], SpriteFrame).then((frames) => {
                DataManager.Instance.textureMap.set(type, frames);
            })
        }

        for (const type in AnimationPathEnum) {
            const p = ResourceManager.Instance.loadRes(AnimationPathEnum[type], AnimationClip).then((clip) => {
                DataManager.Instance.animationMap.set(type, clip);
            });
            list.push(p);
        }

        await Promise.all(list);
    }

    /**
     * 初始化地图
     */
    private initMap(): void {
        const prefab: Prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Map);
        const map: Node = instantiate(prefab);
        map.setParent(this.stage);
    }

    protected update(dt: number): void {
        if (!this.shouldUpdate) return;
        this.render();
        this.tick(dt);
    }

    /**
     * 渲染 将DataManager的数据渲染到舞台上
     */
    private render(): void {
        this.renderActors();
    }

    /**
     * 更新
     * @param dt 时间间隔
     */
    private tick(dt: number): void {
        this.tickActors(dt);
    }

    /**
     * 渲染角色
     */
    private renderActors(): void {
        for (const data of DataManager.Instance.state.actors) {
            const { id, type } = data;
            let am: ActorManager = DataManager.Instance.actorMap.get(id);
            if (!am) {
                const prefab: Prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Actor);
                const actor: Node = instantiate(prefab);
                actor.setParent(this.stage);
                am = actor.addComponent(ActorManager);
                DataManager.Instance.actorMap.set(id, am);
                am.init(data);
            } else {
                am.render(data);
            }
        }
    }

    /**
     * 角色更新
     * @param dt 时间间隔
     */
    private tickActors(dt: number): void {
        for (const data of DataManager.Instance.state.actors) {
            const { id } = data;
            let am: ActorManager = DataManager.Instance.actorMap.get(id);
            am.tick(dt);
        }
    }
}


