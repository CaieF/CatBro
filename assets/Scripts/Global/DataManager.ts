import { Prefab, SpriteFrame, Node, AnimationClip } from "cc";
import Singleton from "../Base/Singleton";
import { ActorManager } from "../Entity/Actor/ActorManager";
import { JoyStickManager } from "../UI/JoyStickManager";
import { ActorTypeEnum, IClientInput, InputTypeEnum, IState } from "../Common";

const ACTOR_SPEED = 100;    // 角色移动速度

/**
 * 数据管理类
 * 负责管理游戏的数据和状态
 */
export default class DataManager extends Singleton {
    public static get Instance() {
        return super.GetInstance<DataManager>();
    }

    public stage: Node;   // 舞台节点
    public jm: JoyStickManager;   // 摇杆管理器
    public actorMap: Map<number, ActorManager> = new Map();   // 角色管理器映射表
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
                direction: { x: 0, y: 0 }
            }
        ]
    }

    /**
     * 申请输入
     * @param input 客户端输入
     */
    public applyInput(input: IClientInput) {
        switch(input.type) {
            case InputTypeEnum.ActorMove: 
                const { id, direction: {x,y}, dt } = input;
                // 查找对应的角色并更新状态
                const actor = this.state.actors.find(a => a.id === id);
                actor.direction = { x, y };
                actor.position.x += x * ACTOR_SPEED * dt;
                actor.position.y += y * ACTOR_SPEED * dt;
                break;
        }
    }
}