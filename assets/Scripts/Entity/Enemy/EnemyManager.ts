import { _decorator, Sprite, Node, Animation, Vec2 } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { AnimationTypeEnum, IActor, IEnemy, InputTypeEnum, IVec2 } from "../../Common";
import DataManager from "../../Global/DataManager";
import EventManager from "../../Global/EventManager";
import { EntityStateEnum, EventEnum } from "../../Enum";
import { EnemyDamageState, EnemyMoveState } from "./State";
import { EnemyStateMachine } from "./EnemyStateMachine";
import { EnemyStats } from "./EnemyStats";
import { EnemyFactory } from "../../Factory/EnemyFactory";
const { ccclass, property } = _decorator;

const Tag = 'EnemyManager';
/**
 * 角色管理类
 * 负责游戏角色的创建，更新，销毁等
 */
@ccclass('EnemyManager') 
export class EnemyManager extends EntityManager {

    public am: Animation;  // 动画组件
    public sprite: Node;  // 角色图片节点
    
    public id: number;  // 角色ID
    public flowDir: Vec2;  // 流动方向
    public stats: EnemyStats;   // 敌人属性

    //#region 状态相关变量 
    private stateMachine: EnemyStateMachine;  // 状态机
    public moveState: EnemyMoveState;  // 移动状态
    public damageState: EnemyDamageState;  // 受伤状态
    //#endregion

    //#region Battle生命周期相关
    /**
     * 敌人初始化
     */
    public init(data: IEnemy): void {
        this.initData(data);
        this.initComponent(data);
        this.initState();

        EventManager.Instance.on(EventEnum.EnemyDamage, this.handleEnemyDamage, this);
        EventManager.Instance.on(EventEnum.EnemyChangeState, this.handleEnemyChangeState, this);
    }

    /**
     * 回收到节点池时调用
     */
    public recycle(): void {
        EventManager.Instance.off(EventEnum.EnemyDamage, this.handleEnemyDamage, this)
        EventManager.Instance.off(EventEnum.EnemyChangeState, this.handleEnemyChangeState, this)
    }

    /**
     * 角色渲染
     * @param data 敌人数据 
     */
    public render(data: IEnemy): void {
        this.stateMachine.currentState?.render(data);
    }
    
    /**
     * 角色更新 数据传给 DataManager 
     * @param dt 时间间隔
     */
    public tick(dt: number): void {
        this.stateMachine.currentState?.tick(dt);  // 更新状态机
    }

    public tickMove(dt: number) {
        this.stateMachine.currentState?.tickMove(dt);  // 更新移动状态
    }
    //#endregion

    //#region 初始化相关
    private initData(data: IEnemy): void {
        this.id = data.id;
        this.node.setPosition(data.position.x, data.position.y);
        this.flowDir = new Vec2(0, 0);

        this.stats = EnemyFactory.Instance.createEnemyStats(data.type, 1);
    }

    private initComponent(data: IEnemy): void {
        // 图片初始化
        this.sprite = this.node.getChildByName('Sprite');
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

    private initState(): void {
        this.stateMachine = new EnemyStateMachine();
        this.moveState = new EnemyMoveState(this, this.stateMachine);
        this.damageState = new EnemyDamageState(this, this.stateMachine);
        this.stateMachine.Initialize(this.moveState);
    }
    //#endregion

    /**
     * 处理敌人受伤事件
     * @param id 敌人ID
     */
    private handleEnemyDamage(id: number, direction: IVec2): void{
        if (id !== this.id) return;
        
        DataManager.Instance.applyInput({
            id: this.id,
            type: InputTypeEnum.EnemyKnockback,
            direction: direction,
            force: 10,
        })
        // this.stateMachine.changeState(this.damageState);  // 切换到受伤状态
    }

    private handleEnemyChangeState(id: number, state: EntityStateEnum): void {
        if (id !== this.id) return;

        switch (state) {
            case EntityStateEnum.Move:
                this.stateMachine.changeState(this.moveState);  // 切换到移动状态
                break;
            case EntityStateEnum.Damage:
                this.stateMachine.changeState(this.damageState);  // 切换到受伤状态
                break;
            default:
                break;
        }
    }
}