import { instantiate, Node } from "cc";
import Singleton from "../Base/Singleton";
import { ActorTypeEnum, EntityTypeEnum } from "../Common";
import DataManager from "./DataManager";

export class ObjectPoolManager extends Singleton {
    public static get Instance() {
        return super.GetInstance<ObjectPoolManager>();
    }

    private objectPool: Node;
    private map: Map<EntityTypeEnum | ActorTypeEnum, Node[]>;


    /**
     * 获取节点
     * @param type 节点类型
     */
    public get(type: EntityTypeEnum): Node {
        if (!this.objectPool) {
            this.objectPool = new Node("ObjectPool");
            this.objectPool.setParent(DataManager.Instance.stage)
        }

        if (!this.map.has(type)) {
            this.map.set(type, []);
            const container = new Node(type + "Pool");
            container.setParent(this.objectPool);
        }

        const nodes: Node[] = this.map.get(type);
        if (!nodes.length) {
            const prefab = DataManager.Instance.prefabMap.get(type);
            const node = instantiate(prefab);
            node.name = type;
            node.setParent(this.objectPool.getChildByName(type + "Pool"));
            node.active = true;
            return node;
        } else {
            const node = nodes.pop();
            node.active = true;
            return node;
        }
    }

    /**
     * 回收节点
     * @param node 节点
     */
    public ret(node: Node): void {
        node.active = false;
        this.map.get(node.name as EntityTypeEnum).push(node);
    }
}