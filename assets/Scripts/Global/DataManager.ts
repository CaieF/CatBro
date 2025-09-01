import { Prefab, SpriteFrame, Node, AnimationClip, Vec2, UITransform, JsonAsset } from "cc";
import Singleton from "../Base/Singleton";
import { ActorManager } from "../Entity/Actor/ActorManager";
import { JoyStickManager } from "../UI/JoyStickManager";
import { ActorEntityTypeEnum, BulletTypeEnum, EnemyEntityTypeEnum, IBullet, IClientInit, IClientInput, IEnemy, IMaterial, InitTypeEnum, InputTypeEnum, IState, ITimePastInput, MaterialTypeEnum, WeaponAttackTypeEnum, WeaponEntityTypeEnum } from "../Common";
import { clamp, CollisionUtil, Debug } from "../Util";
import { EnemyManager } from "../Entity/Enemy/EnemyManager";
import { WeaponManager } from "../Entity/Weapon/WeaponManager";
import EventManager from "./EventManager";
import { EntityStateEnum, EventEnum } from "../Enum";
import { BulletManager } from "../Entity/Bullet/BulletManager";
import { MaterialManager } from "../Entity/Material/MaterialManager";

const ACTOR_SPEED = 450;    // 角色移动速度
export const ENEMY_SPEED = 300;    // 敌人移动速度
const BULLET_SPEED = 1800;
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
    public bulletMap: Map<number, BulletManager> = new Map();   // 子弹映射表
    public materialMap: Map<number, MaterialManager> = new Map();   // 物资映射表
    // public weaponMap: Map<number, WeaponManager> = new Map();   // 武器管理器映射表
    public prefabMap: Map<string, Prefab> = new Map();   // 预制体映射表
    // public actorPrefabMap: Map<string, Prefab> = new Map();   // 角色预制体映射表
    public animationMap: Map<string, AnimationClip> = new Map();   // 动画映射表
    public textureMap: Map<string, SpriteFrame[]> = new Map();   // 贴图映射表
    public configMap: Map<string, JsonAsset> = new Map();   // 配置映射表

    /**
     * 游戏状态
     */
    state: IState = {
        actors: [
            {
                id: 1,
                type: ActorEntityTypeEnum.Actor01,
                position: { x: 0, y: 0 },
                direction: { x: 0, y: 0 },
                weaponList: [
                    {
                        id: 1,
                        type: WeaponEntityTypeEnum.Weapon01,
                        position: { x: 0, y: 0 },
                        direction: { x: 0, y: 0 },
                    },
                    {
                        id: 2,
                        type: WeaponEntityTypeEnum.Weapon01,
                        position: { x: 0, y: 0 },
                        direction: { x: 0, y: 0 },
                    },
                    {
                        id: 3,
                        type: WeaponEntityTypeEnum.Weapon02,
                        position: { x: 0, y: 0 },
                        direction: { x: 0, y: 0 },
                        bulletType: BulletTypeEnum.Bullet01,
                    },
                    {
                        id: 4,
                        type: WeaponEntityTypeEnum.Weapon02,
                        position: { x: 0, y: 0 },
                        direction: { x: 0, y: 0 },
                        bulletType: BulletTypeEnum.Bullet01,
                    },
                    {
                        id: 5,
                        type: WeaponEntityTypeEnum.Weapon02,
                        position: { x: 0, y: 0 },
                        direction: { x: 0, y: 0 },
                        bulletType: BulletTypeEnum.Bullet01,
                    },
                    {
                        id: 6,
                        type: WeaponEntityTypeEnum.Weapon01,
                        position: { x: 0, y: 0 },
                        direction: { x: 0, y: 0 },
                    },
                ]
            },
        ],
        enemies: [
            {
                id: 1,
                type: EnemyEntityTypeEnum.Enemy01,
                position: { x: 500, y: 500 },
                direction: { x: 0, y: 0 }
            },
            {
                id: 2,
                type: EnemyEntityTypeEnum.Enemy01,
                position: { x: -500, y: -500 },
                direction: { x: 0, y: 0 }
            },
            {
                id: 3,
                type: EnemyEntityTypeEnum.Enemy01,
                position: { x: 1000, y: 1000 },
                direction: { x: 0, y: 0 }
            },
            {
                id: 4,
                type: EnemyEntityTypeEnum.Enemy01,
                position: { x: -1000, y: -1000 },
                direction: { x: 0, y: 0 }
            },
            {
                id: 5,
                type: EnemyEntityTypeEnum.Enemy01,
                position: { x: 500, y: -500 },
                direction: { x: 0, y: 0 }
            },
            {
                id: 6,
                type: EnemyEntityTypeEnum.Enemy01,
                position: { x: -500, y: 500 },
                direction: { x: 0, y: 0 }
            },
            {
                id: 7,
                type: EnemyEntityTypeEnum.Enemy01,
                position: { x: 300, y: 300 },
                direction: { x: 0, y: 0 }
            },
            {
                id: 8,
                type: EnemyEntityTypeEnum.Enemy01,
                position: { x: -300, y: -300 },
                direction: { x: 0, y: 0 }
            },
            {
                id: 9,
                type: EnemyEntityTypeEnum.Enemy01,
                position: { x: 8000, y: 8000 },
                direction: { x: 0, y: 0 }
            },
            {
                id: 10,
                type: EnemyEntityTypeEnum.Enemy01,
                position: { x: -800, y: -800 },
                direction: { x: 0, y: 0 }
            },{
                id: 11,
                type: EnemyEntityTypeEnum.Enemy01,
                position: { x: 400, y: -500 },
                direction: { x: 0, y: 0 }
            },
            {
                id: 12,
                type: EnemyEntityTypeEnum.Enemy01,
                position: { x: -400, y: 500 },
                direction: { x: 0, y: 0 }
            },
        ],
        bullets: [],
        materials: [],
        nextEnemyId: 13,
        nextBulletId: 1,
        nextMaterialId: 1,
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
                actor.position.x = clamp(actor.position.x + x * ACTOR_SPEED * dt, -Map_WIDTH, Map_WIDTH);
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
                const em = this.enemyMap.get(enemy.id);
                if (em && em.stats.helath <= 0) {
                    EventManager.Instance.emit(EventEnum.EnemyChangeState, id, EntityStateEnum.Dead);
                    this.enemyDead(id);
                    return;
                }

                enemy.position.x = clamp(enemy.position.x + x * force, -Map_WIDTH, Map_WIDTH);
                enemy.position.y = clamp(enemy.position.y + y * force, -Map_HEIGHT, Map_HEIGHT);

                EventManager.Instance.emit(EventEnum.EnemyChangeState, id, EntityStateEnum.Damage);
                
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
                break;
            }
            case InputTypeEnum.WeaponShoot: {
                const { bulletType, position, direction, damage } = input;
                const bullet: IBullet = {
                    id: this.state.nextBulletId++, position, direction, damage, type: bulletType
                }
                this.state.bullets.push(bullet);
                break;
            }

            case InputTypeEnum.MaterialDrop: {
                const { materialType, position } = input;
                const material: IMaterial = {
                    id: this.state.nextMaterialId++, type: materialType,
                    position,
                }
                this.state.materials.push(material);
                break;
            }

            case InputTypeEnum.MaterialMove: {
                const { id, direction: {x,y}, dt } = input;
                const material = this.state.materials.find(m => m.id === id);
                material.position.x = clamp(material.position.x + x * ACTOR_SPEED * 2 * dt, -Map_WIDTH, Map_WIDTH);
                material.position.y = clamp(material.position.y + y * ACTOR_SPEED * 2 * dt, -Map_HEIGHT, Map_HEIGHT);
                break;
            }

            case InputTypeEnum.TimePast: {
                const { dt } = input;
                const { bullets, enemies } = this.state;

                for (let i = bullets.length - 1; i >= 0; i--) {
                    const bullet = bullets[i];
                    const bm = this.bulletMap.get(bullet.id);

                    if (!bm) {
                        continue;
                    }

                    const rotation = bm.node.eulerAngles.z * Math.PI / 180;
                    const bulletCenter = new Vec2(bullet.position.x, bullet.position.y);
                    const bulletSize = bm.node.getComponent(UITransform).contentSize;
                    const bulletPoints = CollisionUtil.getRotatedRectPoints(bulletCenter, bulletSize.width, bulletSize.height, rotation);
                    let bulletDestroyed = false;

                    for (let j = enemies.length - 1; j >= 0; j--) {
                        const enemy = enemies[j];
                        const enemyCenter = new Vec2(enemy.position.x, enemy.position.y);
                        const enemySize = new Vec2(100, 100);
                        const enemyPoints = CollisionUtil.getAABBPoints(enemyCenter, enemySize.x, enemySize.y);
                        if (CollisionUtil.isPolygonCollide(bulletPoints, enemyPoints)) {
                            EventManager.Instance.emit(EventEnum.BulletDestory, bullet.id);
                            EventManager.Instance.emit(EventEnum.EnemyDamage, enemy.id, bullet.damage, bullet.direction);
                            bullets.splice(i, 1);
                            bulletDestroyed = true;
                            break;
                        }
                    }

                    if (!bulletDestroyed && Math.abs(bullet.position.x) > Map_WIDTH || Math.abs(bullet.position.y) > Map_HEIGHT) {
                        EventManager.Instance.emit(EventEnum.BulletDestory, bullet.id);
                        bullets.splice(i, 1);
                        break;
                    }
                }

                for (const bullet of bullets) {
                    bullet.position.x = bullet.position.x + bullet.direction.x * BULLET_SPEED * dt, -Map_WIDTH, Map_WIDTH;
                    bullet.position.y = bullet.position.y + bullet.direction.y * BULLET_SPEED * dt, -Map_HEIGHT, Map_HEIGHT;
                }
            }
        }
    }


    /**
     * 角色死亡删除舞台上的角色数据
     * @param actorId 角色ID
     */
    public actorDead(actorId: number) {
        this.state.actors.splice(this.state.actors.findIndex(a => a.id === actorId), 1);
        this.actorMap.delete(actorId);
    }

    private enemyDead(enemyId: number) {
        this.state.enemies.splice(this.state.enemies.findIndex(e => e.id === enemyId), 1);
        this.enemyMap.delete(enemyId);
    }

    public materialCollected(materialId: number) {
        this.state.materials.splice(this.state.materials.findIndex(m => m.id === materialId), 1);
        this.materialMap.delete(materialId);
    }

    /**
     * 删新敌人
     */
    public refreshEnemies() {
        if (this.state.actors.length < 1) return;

        if (this.state.enemies.length >= 100) return;

        for (let i = 0; i < 10; i++) {
            const enemy: IEnemy = {
                id: this.state.nextEnemyId++,
                type: EnemyEntityTypeEnum.Enemy01,
                position: { x: (Math.random() - 0.5) * 2 * Map_WIDTH, y: (Math.random() - 0.5) * 2 * Map_HEIGHT },
                direction: { x: 0, y: 0 }
            }
            this.state.enemies.push(enemy);
        }

    }
}