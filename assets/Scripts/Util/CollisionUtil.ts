import { Vec2, Size, IVec2 } from "cc";
import { Debug } from "./Debug";
import { toFixed } from ".";

export class CollisionUtil {
    /**
     * 获取一个旋转矩形的四个顶点
     * @param center 中心点
     * @param width 宽
     * @param height 高
     * @param angleRad 旋转角度（单位：弧度）
     */
    public static getRotatedRectPoints(center: Vec2, width: number, height: number, angleRad: number) :Vec2[]{
        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);
        const hw = width / 2;
        const hh = height / 2;
        const localPoints = [
            new Vec2(-hw, -hh),
            new Vec2(hw, -hh),
            new Vec2(hw, hh),
            new Vec2(-hw, hh),
        ];

        return localPoints.map(p => {
            const rotated = (new Vec2(p.x * cos - p.y * sin, p.x * sin + p.y * cos))
            return new Vec2(rotated.x + center.x, rotated.y + center.y);
        });
    }

    /**
     * 获取轴对齐矩形（AABB）的顶点
     * @parm center 中心点
     * @param width 宽
     * @param height 高
     */
    public static getAABBPoints(center: Vec2, width: number, height: number): Vec2[] {
        const hw = width / 2;
        const hh = height / 2;
        return [
            new Vec2(center.x - hw, center.y - hh),
            new Vec2(center.x + hw, center.y - hh),
            new Vec2(center.x + hw, center.y + hh),
            new Vec2(center.x - hw, center.y + hh),
        ];
    }

    /**
     * 判断两个多边形是否相交（SAT）
     * @param polygonA 多边形A
     * @param polygonB 多边形B
     */
    public static isPolygonCollide(polygonA: Vec2[], polygonB: Vec2[]): boolean {
        // Debug.Log("多边形A", polygonA);
        // Debug.Log("多边形B", polygonB);
        const axes = [...this.getAxes(polygonA), ...this.getAxes(polygonB)];
        for (const axis of axes) {
            const [minA, maxA] = this.projectPolygon(polygonA, axis);
            const [minB, maxB] = this.projectPolygon(polygonB, axis);
            if (maxA < minB || maxB < minA) {
                return false;
            }
        }
        return true;
    }

    /**
     * 获取多边形的所有投影轴（边的法向量）
     */
    private static getAxes(points: Vec2[]): Vec2[] {
        const axes: Vec2[] = [];
        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];
            const edge = p2.clone().subtract(p1);
            const normal = new Vec2(-edge.y, edge.x).normalize();
            axes.push(normal);
        }
        return axes;
    }

    /**
     * 将多边形投影到某个轴上，返回 [最小值, 最大值]
     */
    private static projectPolygon(points: Vec2[], axis: Vec2): [number, number] {
        const dots = points.map(p => p.dot(axis));
        return [Math.min(...dots), Math.max(...dots)];
    }
}
