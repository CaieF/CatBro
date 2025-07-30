import { Prefab, SpriteFrame, Node, AnimationClip } from "cc";
import Singleton from "../Base/Singleton";
import { ActorManager } from "../Entity/Actor/ActorManager";
import { JoyStickManager } from "../UI/JoyStickManager";
import { ActorTypeEnum, EnemyTypeEnum, IClientInit, IClientInput, InitTypeEnum, InputTypeEnum, IState, WeaponTypeEnum } from "../Common";
import { clamp, Debug } from "../Util";
import { EnemyManager } from "../Entity/Enemy/EnemyManager";
import { WeaponManager } from "../Entity/Weapon/WeaponManager";

const ACTOR_SPEED = 500;    // 角色移动速度
export const ENEMY_SPEED = 300;    // 敌人移动速度
const Map_WIDTH = 1665;
const Map_HEIGHT = 1125;
const Tag = 'DataManager';
/**
 * 数据管理类
 * 负责管理游戏的数据和状态
 */
export default class DataManager extends Singleton {
    public static get Instance() {
        return super.GetInstance<DataManager>();
    }

    public myPlayerId: number = 1;   // 玩家ID
    public myPlayer: Node;   // 玩家节点

    public stage: Node;   // 舞台节点
    public jm: JoyStickManager;   // 摇杆管理器
    public actorMap: Map<number, ActorManager> = new Map();   // 角色管理器映射表
    public enemyMap: Map<number, EnemyManager> = new Map();   // 敌人管理器映射表
    // public weaponMap: Map<number, WeaponManager> = new Map();   // 武器管理器映射表
    public prefabMap: Map<string, Prefab> = new Map();   // 预制体映射表
    // public actorPrefabMap: Map<string, Prefab> = new Map();   // 角色预制体映射表
    public animationMap: Map<string, AnimationClip> = new Map();   // 动画映射表
    public textureMap: Map<string, SpriteFrame[]> = new Map();   // 贴图映射表

    /**
     * 游戏状态
     */
    state: IState = {
        actors: [
            {
                id: 1,
                type: ActorTypeEnum.Actor01,
                position: { x: 0, y: 0 },
                direction: { x: 0, y: 0 },
                weaponList: [
                    {
                        id: 1,
                        type: WeaponTypeEnum.Weapon01,
                        position: { x: 0, y: 0 },
                        direction: { x: 0, y: 0 }
                    },
                    {
                        id: 2,
                        type: WeaponTypeEnum.Weapon01,
                        position: { x: 0, y: 0 },
                        direction: { x: 0, y: 0 }
                    },
                    {
                        id: 3,
                        type: WeaponTypeEnum.Weapon01,
                        position: { x: 0, y: 0 },
                        direction: { x: 0, y: 0 }
                    },
                    {
                        id: 4,
                        type: WeaponTypeEnum.Weapon01,
                        position: { x: 0, y: 0 },
                        direction: { x: 0, y: 0 }
                    },
                    {
                        id: 5,
                        type: WeaponTypeEnum.Weapon01,
                        position: { x: 0, y: 0 },
                        direction: { x: 0, y: 0 }
                    },
                    {
                        id: 6,
                        type: WeaponTypeEnum.Weapon01,
                        position: { x: 0, y: 0 },
                        direction: { x: 0, y: 0 }
                    }
                ]
            },
        ],
        enemies: [
            {
                id: 1,
                type: EnemyTypeEnum.Enemy01,
                position: { x: 500, y: 500 },
                direction: { x: 0, y: 0 }
            },
            {
                id: 2,
                type: EnemyTypeEnum.Enemy01,
                position: { x: -500, y: -500 },
                direction: { x: 0, y: 0 }
            },
            {
                id: 3,
                type: EnemyTypeEnum.Enemy01,
                position: { x: 1000, y: 1000 },
                direction: { x: 0, y: 0 }
            },
            {
                id: 4,
                type: EnemyTypeEnum.Enemy01,
                position: { x: -1000, y: -1000 },
                direction: { x: 0, y: 0 }
            },
            {
                id: 5,
                type: EnemyTypeEnum.Enemy01,
                position: { x: 500, y: -500 },
                direction: { x: 0, y: 0 }
            },
            {
                id: 6,
                type: EnemyTypeEnum.Enemy01,
                position: { x: -500, y: 500 },
                direction: { x: 0, y: 0 }
            },
            {
                id: 7,
                type: EnemyTypeEnum.Enemy01,
                position: { x: 300, y: 300 },
                direction: { x: 0, y: 0 }
            },
            {
                id: 8,
                type: EnemyTypeEnum.Enemy01,
                position: { x: -300, y: -300 },
                direction: { x: 0, y: 0 }
            },
            {
                id: 9,
                type: EnemyTypeEnum.Enemy01,
                position: { x: 8000, y: 8000 },
                direction: { x: 0, y: 0 }
            },
            {
                id: 10,
                type: EnemyTypeEnum.Enemy01,
                position: { x: -800, y: -800 },
                direction: { x: 0, y: 0 }
            },{
                id: 11,
                type: EnemyTypeEnum.Enemy01,
                position: { x: 400, y: -500 },
                direction: { x: 0, y: 0 }
            },
            {
                id: 12,
                type: EnemyTypeEnum.Enemy01,
                position: { x: -400, y: 500 },
                direction: { x: 0, y: 0 }
            },
        ]
    }

    /**
     * 申请初始化数据
     * @param init 初始化客户端数据
     */
    public applyInit(init: IClientInit) {
        switch (init.type) {
            case InitTypeEnum.InitWeapon: {
                const { id, actorId, position } = init;
                const actor = this.state.actors.find(a => a.id === actorId);
                const weapon = actor.weaponList.find(w => w.id === id);
                weapon.position = position;
                break;
            }
        }

    }


    /**
     * 申请输入
     * @param input 客户端输入
     */
    public applyInput(input: IClientInput) {
        switch(input.type) {
            case InputTypeEnum.ActorMove: {
                const { id, direction: {x,y}, dt } = input;
                // 查找对应的角色并更新状态
                const actor = this.state.actors.find(a => a.id === id);
                actor.direction = { x, y };
                // actor.position.x += x * ACTOR_SPEED * dt;
                actor.position.x = clamp(actor.position.x + x * ACTOR_SPEED * dt, -Map_WIDTH, Map_WIDTH);
                // actor.position.y += y * ACTOR_SPEED * dt;
                actor.position.y = clamp(actor.position.y + y * ACTOR_SPEED * dt, -Map_HEIGHT, Map_HEIGHT);
                break;
            }
                
            case InputTypeEnum.EnemyMove: {
                const { id, direction: {x,y},speed, dt } = input;
                const enemy = this.state.enemies.find(e => e.id === id);

                const actualSpeed = Math.min(speed, ENEMY_SPEED);
                enemy.direction = { x, y };
                enemy.position.x = clamp(enemy.position.x + x * actualSpeed * dt, -Map_WIDTH, Map_WIDTH);
                enemy.position.y = clamp(enemy.position.y + y * actualSpeed * dt, -Map_HEIGHT, Map_HEIGHT);
                Number.isNaN(enemy.position.x) && Debug.Error(Tag, enemy.position + '速度' + actualSpeed + '方向' + x);
                break;
            }

            case InputTypeEnum.EnemyKnockback: {
                const { id, direction: {x,y}, force } = input;
                const enemy = this.state.enemies.find(e => e.id === id);

                enemy.position.x = clamp(enemy.position.x + x * force, -Map_WIDTH, Map_WIDTH);
                enemy.position.y = clamp(enemy.position.y + y * force, -Map_HEIGHT, Map_HEIGHT);
                break;
            }

            case InputTypeEnum.WeaponAim: {
                const { id, actorId, direction: {x,y} } = input;
                const actor = this.state.actors.find(a => a.id === actorId);
                const weapon = actor.weaponList.find(w => w.id === id);
                weapon.direction = { x, y };
                break;
            }
            case InputTypeEnum.WeaponMove: {
                const { id, actorId, position:{ x, y } } = input;
                const actor = this.state.actors.find(a => a.id === actorId);
                const weapon = actor.weaponList.find(w => w.id === id);
                weapon.position = { x, y }
            }
        }
    }
}