import { Node, UITransform } from "cc";
import DataManager from "../Global/DataManager";

export * from "./Debug";

/**
 * 将数据限制在最小值和最大值之间
 * @param Value 传入的数据
 * @param Min 最小值
 * @param Max 最大值
 * @returns 限制后的数据
 */
export const clamp = (Value: number, Min: number, Max: number) => {
    return Math.min(Math.max(Value, Min), Max);
}

/**
 * 弧度制转角度 
 */
export const rad2Angle = (rad: number)=> {
    return (rad / Math.PI) * 180;
}

/**
 * 获取节点的世界坐标
 */
export const getWorldPosition = (node: Node) => {
    return node.worldPosition.clone();
}

/**
 * @cn 获取节点在舞台上的位置
 * @en Get the position of the node on the stage.
 */
export const getStagePosition = (node: Node) => {
    const worldPos = getWorldPosition(node);
    return DataManager.Instance.stage.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
}

/**
 * 获取节点相对于另一个节点的位置
 * @param node 需要获取位置的节点
 * @param relative 相对位置的节点
 */
export const getRelativePosition = (node: Node, relative: Node) => {
    const worldPos = getWorldPosition(node);
    return relative.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
}