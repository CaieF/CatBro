import { _decorator, AnimationClip, Component, find, instantiate, JsonAsset, Node, Prefab, resources, SpriteFrame, UITransform } from 'cc';
import DataManager from '../Global/DataManager';
import { JoyStickManager } from '../UI/JoyStickManager';
import { AnimationPathEnum, ConfigPathEnum, PrefabPathEnum, TexturePathEnum } from '../Enum';
import { ResourceManager } from '../Global/ResourceManager';
import { ActorManager } from '../Entity/Actor/ActorManager';
import { EntityTypeEnum, InputTypeEnum } from '../Common';
import { EnemyManager } from '../Entity/Enemy/EnemyManager';
import { ObjectPoolManager } from '../Global/ObjectPoolManager';
import { FlowFieledManager } from '../Global/FlowFieledManager';
import { RVOManager } from '../Global/RVOManager';
import { BulletManager } from '../Entity/Bullet/BulletManager';
import { WeaponFactory } from '../Factory/WeaponFactory';
import { Debug } from '../Util';
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
        this.ui = find('UICanvas/UI');

        this.stage.removeAllChildren();

        DataManager.Instance.jm = this.ui.getComponentInChildren(JoyStickManager);
    }

    protected async start(): Promise<void> {
        await this.loadRes();
        this.initMap();
        this.initFactory();
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
            });
            list.push(p);
        }

        for (const type in AnimationPathEnum) {
            const p = ResourceManager.Instance.loadRes(AnimationPathEnum[type], AnimationClip).then((clip) => {
                DataManager.Instance.animationMap.set(type, clip);
            });
            list.push(p);
        }

        for (const type in ConfigPathEnum) {
            const p = ResourceManager.Instance.loadRes(ConfigPathEnum[type], JsonAsset).then((asset) => {
                DataManager.Instance.configMap.set(type, asset);
                Debug.Log(`load config ${ConfigPathEnum[type]} success`, DataManager.Instance.configMap);
            })
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
        // FlowFieledManager.Instance.init(40, map.getComponent(UITransform).width, map.getComponent(UITransform).height,map);
    }

    /**
     * 初始化工厂
     */
    private initFactory(): void {
        WeaponFactory.Instance.init();
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
        this.renderEnemies();
        this.renderBullets();
    }

    /**
     * 更新
     * @param dt 时间间隔
     */
    private tick(dt: number): void {
        this.tickActors(dt);
        this.tickEnemies(dt);
        RVOManager.Instance.tick(dt);
        this.tickEnemiesMove(dt);
        // this.tickBullets(dt);

        DataManager.Instance.applyInput({
            type: InputTypeEnum.TimePast,
            dt
        })
    }

    //#region 渲染相关
    /**
     * 渲染角色
     */
    private renderActors(): void {
        for (const data of DataManager.Instance.state.actors) {
            const { id } = data;
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
     * 渲染敌人
     */
    private renderEnemies(): void {
        for (const data of DataManager.Instance.state.enemies) {
            const { id } = data;
            let em: EnemyManager = DataManager.Instance.enemyMap.get(id);
            if (!em) {
                const enemy: Node = ObjectPoolManager.Instance.get(EntityTypeEnum.Enemy);
                em = enemy.getComponent(EnemyManager) || enemy.addComponent(EnemyManager);
                DataManager.Instance.enemyMap.set(id, em);
                em.init(data);
            } else {
                em.render(data);
            }
        }
    }

    /**
     * 渲染子弹
     */
    private renderBullets(): void {
        for (const data of DataManager.Instance.state.bullets) {
            const { id } = data;
            let bm: BulletManager = DataManager.Instance.bulletMap.get(id);
            if (!bm) {
                const bullet: Node = ObjectPoolManager.Instance.get(EntityTypeEnum.Bullet);
                bm = bullet.getComponent(BulletManager) || bullet.addComponent(BulletManager);
                DataManager.Instance.bulletMap.set(id, bm);
                bm.init(data);
            } else {
                bm.render(data);
            }
        }
    }
    //#endregion

    //#region 更新相关
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

    /**
     * 敌人更新
     * @param dt 时间间隔
     */
    private tickEnemies(dt: number): void {
        for (const data of DataManager.Instance.state.enemies) {
            const { id } = data;
            let em: EnemyManager = DataManager.Instance.enemyMap.get(id);
            em.tick(dt);
        }
    }

    private tickEnemiesMove(dt: number): void {
        for (const data of DataManager.Instance.state.enemies) {
            const { id } = data;
            let em: EnemyManager = DataManager.Instance.enemyMap.get(id);
            em.tickMove(dt);
        }
    }

    // private tickBullets(dt: number): void {
    //     for (const data of DataManager.Instance.state.bullets) {
    //         const { id } = data;
    //         let bm: BulletManager = DataManager.Instance.bulletMap.get(id);
    //         bm.tick(dt);
    //     }
    // }
    //#endregion
}


