import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 实体管理类
 * 负责游戏实体的创建，更新，销毁等
 */
@ccclass('EntityManager')
export abstract class EntityManager extends Component {
    
    abstract init(...args: any[]): void;
}


