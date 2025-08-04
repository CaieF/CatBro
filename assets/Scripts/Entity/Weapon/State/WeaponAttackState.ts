import { WeaponState } from "../WeaponState";
import { IWeapon } from "../../../Common";


export class WeaponAttackState extends WeaponState { 

    public enter(): void {
        this.manager.behavior.enterAttackState();
    }

    public exit(): void {
        this.manager.attackTimer = 0;
        this.manager.behavior.exitAttackState();
    }

    public tick(dt: number) {
        this.manager.behavior.tickAttackState(dt);
    }

    public render(data: IWeapon): void {
        this.manager.behavior.renderAttackState(data);
    }
}