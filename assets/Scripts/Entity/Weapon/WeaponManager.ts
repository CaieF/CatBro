import { _decorator, Sprite, Vec2, Node } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import DataManager from "../../Global/DataManager";
import { IWeapon, WeaponAttackTypeEnum } from "../../Common";
import { WeaponStateMachine } from "./WeaponStateMachine";
import { WeaponAttackState, WeaponIdleState } from "./State";
import { MeleeBehavior, RangedBehavior } from "./Behavior";
import { IWeaponBehavior } from "./IWeaponBehavior";
import { WeaponStats } from "./WeaponStats";
import { WeaponFactory } from "../../Factory/WeaponFactory";

const { ccclass } = _decorator;

const Tag = 'WeaponManager';

@ccclass("WeaponManager")
export class WeaponManager extends EntityManager {

    //#region 武器数据相关变量
    public id: number; // 武器ID
    public actorId: number; // 武器所属角色ID
    public defaultPos: Vec2; // 默认位置
    //#endregion

    //#region 武器状态相关变量
    public stateMachine: WeaponStateMachine; // 武器状态机
    public idleState: WeaponIdleState; // 武器空闲状态
    public attackState: WeaponAttackState; // 武器攻击状态
    //#endregion

    //#region 武器属性相关变量
    public attackTimer: number; // 武器攻击计时器
    public attackInterval: number; // 武器攻击间隔
    public attackDistance: number; // 武器攻击距离
    public behavior: IWeaponBehavior; // 武器攻击行为
    public stats: WeaponStats; // 武器属性
    //#endregion

    public point: Node; // 武器攻击点

    //#region Battle生命周期相关
    /**
     * 武器初始化
     * @param data 武器数据
     * @param actorId 武器所属角色ID
     */
    public init(data: IWeapon, actorId: number) {
        this.initData(data, actorId);
        this.initState();
        this.initStats(data);
    }

    /**
     * 武器渲染
     */
    public render(data: IWeapon) {
        this.stateMachine.currentState.render(data);
    }

    /**
     * 武器更新
     * @param dt 
     */
    public tick(dt: number): void {
        this.stateMachine.currentState.tick(dt);
    }
    //#endregion

    //#region 初始化相关
    /**
     * 初始化数据
     * @param data 武器数据
     */
    private initData(data: IWeapon, actorId: number) {
        this.id = data.id;
        this.actorId = actorId;

        // 图片初始化
        // this.node.getComponent(Sprite).spriteFrame = DataManager.Instance.textureMap.get(data.type)[0];
        this.node.setPosition(data.position.x, data.position.y);
        this.defaultPos = new Vec2(data.position.x, data.position.y);
    }

    /**
     * 初始化属性
     */
    private initStats(data: IWeapon) {
        this.stats = WeaponFactory.Instance.createWeaponStats(data.type);
        this.attackTimer = 0;
        this.attackInterval = this.stats.attackInterval;
        this.attackDistance = this.stats.attackRange;

        switch (this.stats.attackType) {
            case WeaponAttackTypeEnum.Melee:
                this.behavior = new MeleeBehavior(this);
                break;
            case WeaponAttackTypeEnum.Ranged:
                this.behavior = new RangedBehavior(this);
                this.point = this.node.getChildByName('Point');
                break;
            default:
                break;
        }
    }

    /**
     * 初始化状态
     */
    private initState() {
        this.stateMachine = new WeaponStateMachine();
        this.idleState = new WeaponIdleState(this, this.stateMachine);
        this.attackState = new WeaponAttackState(this, this.stateMachine);
        this.stateMachine.Initialize(this.idleState);
    }
    //#endregion
}