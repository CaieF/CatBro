import { _decorator, Component, Label, Node, RichText, Sprite } from 'cc';
import { ActorEntityTypeEnum, WeaponEntityTypeEnum } from '../../Common';
import { IActorConfig } from '../../Factory/ActorFactory';
import DataManager from '../../Global/DataManager';
import { IWeaponConfig } from '../../Factory/WeaponFactory';
const { ccclass, property } = _decorator;

/** 选择武器信息面板 */
@ccclass('PanelSelectWeapon')
export class PanelSelectWeapon extends Component {
    @property({ type: Label, tooltip: '选择武器名称' })
    private labelWeaponName: Label = null;

    @property({ type: RichText, tooltip: '选择武器描述' })
    private labelWeaponDesc: RichText = null;

    @property({ type: Sprite, tooltip: '选择角色头像' })
    private spriteHeroIcon: Sprite = null;

    /** 渲染 */
    public render(weaponType: WeaponEntityTypeEnum, weaponConfig: IWeaponConfig) {
        this.labelWeaponDesc.string = "";
        this.labelWeaponName.string = weaponConfig.name;
                
        this.labelWeaponDesc.string = `<color=#f3eab6>伤害</color>: ${weaponConfig.baseDamage}(+${weaponConfig.meleeAddDamage *100}%近 +${weaponConfig.rangedAddDamage *100}%远 +${weaponConfig.elementAddDamage *100}%元素)\n<color=#f3eab6>冷却</color>: ${weaponConfig.attackInterval}s\n<color=#f3eab6>范围</color>: ${weaponConfig.attackRange}\n
        `
        
        this.spriteHeroIcon.spriteFrame = DataManager.Instance.textureMap.get(weaponType)[0];
    }
}


