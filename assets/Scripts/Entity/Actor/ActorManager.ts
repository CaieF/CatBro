import { _decorator, Animation, instantiate, Node, Sprite } from 'cc';
import { AnimationTypeEnum, EntityTypeEnum, IActor, InitTypeEnum, IWeapon } from '../../Common';
import DataManager from '../../Global/DataManager';
import { EntityManager } from '../../Base/EntityManager';
import { WeaponManager } from '../Weapon/WeaponManager';
import { ActorStateMachine } from './ActorStateMachin';
import { ActorIdleState, ActorMoveState } from './State';
const { ccclass, property } = _decorator;

/**
 * 角色管理类
 * 负责游戏角色的创建，更新，销毁等
 */
@ccclass('ActorManager')
export class ActorManager extends EntityManager {
    
    public am: Animation;  // 动画组件
    public sprite: Node;  // 角色图片节点

    //#region 武器相关变量
    private weapons: Node;  // 武器父节点
    private weaponMap: Map<number, WeaponManager> = new Map();  // 武器管理器
    private weaponList: IWeapon[] = [];  // 武器数据
    //#endregion

    //#region 状态相关变量
    private stateMachine: ActorStateMachine;  // 状态机
    public idleState: ActorIdleState;   // 待机状态
    public moveState: ActorMoveState;   // 移动状态
    //#endregion

    public id: number;  // 角色ID

    //#region Battle生命周期相关
    /**
     * 角色初始化
     */
    public init(data: IActor): void {
        this.initData(data);
        this.initComponent(data);
        this.initState();
        this.initWeapons(data.weaponList);
    }

    /**
     * 角色渲染
     * @param data 角色数据 
     */
    public render(data: IActor): void {
        this.stateMachine.currentState?.render(data);
        this.renderWeapons();
    }

    /**
     * 角色更新 数据传给 DataManager 
     * @param dt 时间间隔
     */
    public tick(dt: number): void {
        this.stateMachine.currentState?.tick(dt);
        this.tickWeapons(dt);
    }
    //#endregion

    //#region 初始化相关
    /**
     * 数据初始化
     * @param data 角色数据
     */
    private initData(data: IActor): void {
        this.id = data.id;
        this.weaponList = data.weaponList;
        if (this.id === DataManager.Instance.myPlayerId) {
            DataManager.Instance.myPlayer = this.node;
        }
        this.node.setPosition(data.position.x, data.position.y);
    }

    /**
     * 组件初始化
     * @param data 角色数据
     */
    private initComponent(data: IActor): void {
        // 图片初始化
        this.sprite = this.node.getChildByName('Sprite');
        this.weapons = this.node.getChildByName('Weapons');
        this.sprite.getComponent(Sprite).spriteFrame = DataManager.Instance.textureMap.get(data.type)[0];

        // 动画组件初始化
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
     * 状态初始化
     */
    private initState(): void {
        this.stateMachine = new ActorStateMachine();
        this.idleState = new ActorIdleState(this, this.stateMachine);
        this.moveState = new ActorMoveState(this, this.stateMachine);
        this.stateMachine.Initialize(this.idleState);
    }
    //#endregion

    //#region 武器相关
    /**
     * 初始化武器
     */
    private initWeapons(weapons: IWeapon[]) {
        for (const data of weapons) {
            const { id } = data;
            let wm: WeaponManager = this.weaponMap.get(id);
            if (!wm) {
                const prefab = DataManager.Instance.prefabMap.get(data.type);
                const weapon: Node = instantiate(prefab);
                weapon.setParent(this.weapons);
                // 设置每把武器，使武器位置环绕父节点 计算武器环绕父节点的位置
                const angle = (2 * Math.PI / weapons.length) * weapons.indexOf(data);
                const radius = 65; // 可根据需要调整半径
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                DataManager.Instance.applyInit({
                    type: InitTypeEnum.InitWeapon,
                    id: data.id,
                    actorId: this.id,
                    position: { x, y },
                })
                // weapon.setPosition(x, y);
                wm = weapon.addComponent(WeaponManager);
                this.weaponMap.set(id, wm);
                wm.init(data, this.id);
            }
        }
    }

    /**
     * 渲染武器
     */
    private renderWeapons() {
        for (const data of this.weaponList) {
            const { id } = data;
            let wm = this.weaponMap.get(id);
            if (wm) {
                wm.render(data);
            }
        }
    }

    /**
     * 武器更新
     * @param dt 时间间隔
     */
    private tickWeapons(dt: number) {
        for (const data of this.weaponList) {
            const { id } = data;
            let wm = this.weaponMap.get(id);
            if (wm) {
                wm.tick(dt);
            }
        }
    }
    //#endregion
}


