import { Color, Sprite, tween, Tween, Vec3 } from "cc";
import { IEnemy } from "../../../Common";
import { EnemyState } from "../EnemyState";

export class EnemyDamageState extends EnemyState {
    private tw: Tween;

    public enter(): void {
        this.tw = null;
        this.manager.sprite.getComponent(Sprite).color = new Color(0, 255, 255); // 此颜色为shader白色
    }

    public exit(): void {
        this.tw?.stop();
        this.manager.sprite.getComponent(Sprite).color = new Color(255, 255, 255); // 正常纹理颜色
    }

    public tick(dt: number): void {
        
    }

    public tickMove(dt: number): void {
        
    }

    public render(data: IEnemy): void {
        const { position } = data;
        if (!this.tw) {
            this.tw = tween(this.manager.node)
                .to(0.1, { position: new Vec3(position.x, position.y) })
                .call(() => {
                    this.changeToMove();
                })
                .start();
        }
    }

    private changeToMove(): void {
        this.stateMachine.changeState(this.manager.moveState);
    }
}