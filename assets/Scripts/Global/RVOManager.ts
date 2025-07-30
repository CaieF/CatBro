import { randomRange, Vec2, Vec3 } from "cc";
import Singleton from "../Base/Singleton";
import { IVec2 } from "../Common";
import { ENEMY_SPEED } from "./DataManager";
import { Debug } from "../Util";

/**
 * RVO 代理
 */
export interface IRVOAgent {
    id: number;
    position: Vec2;
    velocity: Vec2;
    prefVelocity: Vec2;
    radius: number;
    maxSpeed: number;
}

const MIN_VECTOR_LENGTH = 0.001;
const Tag = 'RVOManager';

export class RVOManager extends Singleton {

    public static get Instance() {
        return super.GetInstance<RVOManager>();
    }

    private agents: Map<number, IRVOAgent> = new Map();

    /**
     * 注册/更新代理
     */
    public updateAgentPosition(id: number, position: Vec2) {
        let agent = this.agents.get(id);
        if (!agent) {
            agent = {
                id,
                position: position.clone(),
                velocity: new Vec2(0, 0),
                prefVelocity: new Vec2(0, 0),
                radius: 120,
                maxSpeed: randomRange(ENEMY_SPEED * 0.8, ENEMY_SPEED * 1.2),
            };
            this.agents.set(id, agent);
        } else {
            agent.position = position.clone();
        }
    }

    /**
     * 设置期望速度
     */
    public setPreferVelocity(id: number, prefVelocity: Vec2) {
        const agent = this.agents.get(id);
        if (agent) {
            agent.prefVelocity = prefVelocity.clone();
        }
    }

    /**
     * 更新所有代理速度，避免重叠
     */
    public tick(dt: number) {
        const agentsArray = Array.from(this.agents.values());
    
        agentsArray.forEach(agent => {
            let avoidance = new Vec2(0, 0);
            let totalWeight = 0;

            agentsArray.forEach(other => {
                if (agent.id === other.id) return;

                const dist = Vec2.distance(agent.position, other.position);
                const minDist = agent.radius + other.radius;

                if (dist < minDist * 1.5) {
                    // 计算排斥力 (1/distance^2 的关系)
                    const weight = 1 / (dist * dist + 0.001);
                    const dir = agent.position.subtract(other.position).normalize();

                    avoidance = avoidance.add(dir.multiplyScalar(weight * minDist));
                    totalWeight += weight;
                }
            });

            // 安全处理向量情况
            let finalVelocity = new Vec2(0,0)

            if (totalWeight > 0) {
                avoidance = avoidance.multiplyScalar(1 / totalWeight);
                // 合成最终速度 (60%原方向 + 40%避障方向)
                const combined = agent.prefVelocity
                    .multiplyScalar(0.6)
                    .add(avoidance.multiplyScalar(0.5))
                    .normalize()
                    
                if (combined.lengthSqr() > MIN_VECTOR_LENGTH * MIN_VECTOR_LENGTH) {
                    finalVelocity = combined.multiplyScalar(agent.maxSpeed);
                } else if (agent.prefVelocity.lengthSqr() > MIN_VECTOR_LENGTH * MIN_VECTOR_LENGTH) {
                    finalVelocity = agent.prefVelocity.clone().normalize().multiplyScalar(agent.maxSpeed);
                }

            } else {

                if (agent.prefVelocity.lengthSqr() > MIN_VECTOR_LENGTH * MIN_VECTOR_LENGTH) {
                    finalVelocity = agent.prefVelocity.clone().normalize().multiplyScalar(agent.maxSpeed);
                }
            }
            agent.velocity = this.sanitizeVector(finalVelocity);
        });
        
    }

    /**
     * 获取代理速度
     */
    public getVelocity(id: number): Vec2 {
        const agent = this.agents.get(id);
        return agent ? agent.velocity.clone() : new Vec2(0, 0);
    }

    /**
    * 辅助函数：确保向量有效
    */
    private sanitizeVector(v: Vec2): Vec2 {
        if (isNaN(v.x) || isNaN(v.y)) {
            Debug.Warn(Tag, `NaN vector detected, resetting to zero`);
            return new Vec2(0, 0);
        }
        return v;
    }
}