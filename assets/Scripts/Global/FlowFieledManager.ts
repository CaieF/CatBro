import { UITransform, Vec2, Node, Vec3 } from "cc";
import Singleton from "../Base/Singleton";
import { clamp, Debug } from "../Util";

const Tag: string = "FlowFieledManager";
/**
 * Flow Field 流场寻路
 */
export class FlowFieledManager extends Singleton {
    public static get Instance() {
        return super.GetInstance<FlowFieledManager>();
    }

    private flowField: Vec2[][];   // 流场数据
    private gridSize: number = 40;   // 网格大小
    private cols: number;   // 网格列数
    private rows: number;   // 网格行数
    private map: Node;
    private occupancyGrid: (number | null)[][];   // 占领网格

    private lastTargetPos: Vec3 = new Vec3(0, 0, 0);   // 上一次目标位置
    private threshold: number = 32;   // 寻路阈值

    /**
     * 初始化地图
     * @param gridSize 网格大小
     * @param Map_WIDTH 地图宽度
     * @param Map_HEIGHT 地图高度
     * @param map 地图节点
     */
    public init(gridSize: number, Map_WIDTH: number, Map_HEIGHT: number, map: Node) {
        this.gridSize = gridSize;
        this.cols = Math.ceil(Map_WIDTH / gridSize);
        this.rows = Math.ceil(Map_HEIGHT / gridSize);
        this.map = map;
        this.flowField = Array.from({ length: this.rows }, () =>
            Array.from({ length: this.cols }, () => new Vec2(0, 0))
        );
        this.occupancyGrid = Array.from({ length: this.rows }, () =>
            Array.from({ length: this.cols }, () => null)
        );
    }

    /**
     * 生成流场方向字段（没有障碍时）
     * @param targetWorldPos 目标世界坐标
     */
    public generateFlowField(targetWorldPos: Vec3) {
        if (!this.map) return;

        const localTargetPos = this.map.getComponent(UITransform).convertToNodeSpaceAR(targetWorldPos);
        this.lastTargetPos = targetWorldPos.clone();
        // 将目标位置偏移成正值坐标
        const offsetTargetX = localTargetPos.x + (this.cols * this.gridSize) / 2;
        const offsetTargetY = localTargetPos.y + (this.rows * this.gridSize) / 2;

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const cx = x * this.gridSize + this.gridSize / 2;
                const cy = y * this.gridSize + this.gridSize / 2;

                const dir = new Vec2(offsetTargetX - cx, offsetTargetY - cy).normalize();
                this.flowField[y][x] = dir;
            }
        }
    }

    /**
     * 获取某个世界坐标下的移动方向
     * @param worldPos 敌人的世界坐标
     */
    public getDirectionAt(worldPos: Vec3): Vec2 {
        if (!this.map) return new Vec2(0, 0);

        if (isNaN(worldPos.x) || isNaN(worldPos.y)) {
            Debug.Error(Tag, "Invalid world position");
            return Vec2.ZERO;
        }

        const localPos = this.map.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
        
        if (isNaN(localPos.x) || isNaN(localPos.y)) {
            Debug.Error(Tag, "Invalid local position");
            return Vec2.ZERO;
        }


        // 偏移坐标到正数区间：锚点为(0.5, 0.5)，中心为(0,0)，左上角为(-w/2, h/2)
        const offsetX = clamp((localPos.x + (this.cols * this.gridSize) / 2), 0, this.cols * this.gridSize);
        const offsetY = clamp((localPos.y + (this.rows * this.gridSize) / 2), 0, this.rows * this.gridSize);
        // const offsetY = localPos.y + (this.rows * this.gridSize) / 2;

        const gridX = Math.floor(offsetX / this.gridSize);
        const gridY = Math.floor(offsetY / this.gridSize);

        if (gridX < 0 || gridY < 0 || gridX >= this.cols || gridY >= this.rows) {
            return new Vec2(0, 0);
        }


        return  this.flowField[gridY][gridX];
    }

    /**
     * 判断是否需要更新流场
     */
    public shouldUpdateFlow(targetWorldPos: Vec3): boolean {
        if (!this.map) return false;
        return Vec2.distance(this.lastTargetPos, targetWorldPos) > this.threshold;
    }

    /**
     * 判断是否接近终点
     */
    public isAtTarget(worldPos: Vec3, threshold = 30): boolean {
        return Vec2.distance(new Vec2(worldPos.x, worldPos.y), new Vec2(this.lastTargetPos.x, this.lastTargetPos.y)) < threshold;
    }

    /**
     * 将世界坐标转换为网格坐标
     * @param worldPos 世界坐标
     * @returns 
     */
    public worldToGrid(worldPos: Vec3): { x: number, y: number } {
        const local = this.map.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
        return {
            x: Math.floor((local.x + (this.cols * this.gridSize) / 2) / this.gridSize),
            y: Math.floor((local.y + (this.rows * this.gridSize) / 2) / this.gridSize)
        };
    }

    /**
     * 占领网格
     * @param x 
     * @param y 
     * @param id 
     * @returns 
     */
    public occupyGrid(x: number, y: number, id: number): boolean {
        if (this.occupancyGrid[y]?.[x] == null) {
            this.occupancyGrid[y][x] = id;
            return true;
        }
        return false;
    }

    /**
     * 释放网格
     * @param x 
     * @param y 
     * @param id 
     */
    public releaseGrid(x: number, y: number, id: number) {
        if (this.occupancyGrid[y]?.[x] === id) {
            this.occupancyGrid[y][x] = null;
        }
    }

    /**
     * 寻找最近的网格
     * @param x 
     * @param y 
     * @returns 
     */
    public findNearbyFreeGrid(x: number, y: number): { x: number, y: number } | null {
        const directions = [
            [0, 1], [1, 0], [-1, 0], [0, -1],
            [1, 1], [-1, 1], [1, -1], [-1, -1]
        ];
        for (const [dx, dy] of directions) {
            const nx = x + dx, ny = y + dy;
            if (this.occupancyGrid[ny]?.[nx] == null) return { x: nx, y: ny };
        }
        return null;
    }

    public gridToWorld(x: number, y: number): Vec3 {
        const cx = x * this.gridSize + this.gridSize / 2;
        const cy = y * this.gridSize + this.gridSize / 2;
        const local = new Vec3(cx - (this.cols * this.gridSize) / 2, cy - (this.rows * this.gridSize) / 2);
        return this.map.getComponent(UITransform).convertToWorldSpaceAR(local);
    }
}