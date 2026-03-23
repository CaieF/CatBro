# CatBro - 2D动作Roguelike游戏代码详解

## 🎮 项目概述

CatBro是一个基于Cocos Creator 3.8.6开发的2D动作Roguelike游戏，玩家控制可爱的猫咪角色在战场上生存、战斗、收集资源并升级装备。项目采用TypeScript开发，运用了多种设计模式，具有良好的代码架构和扩展性。

### ✨ 核心特色
- **流畅的战斗体验**: 近战武器环绕攻击 + 远程子弹射击
- **丰富的升级系统**: 经验值、等级提升、属性强化、武器解锁
- **策略性玩法**: 不同的角色和武器组合，多样化的Build思路
- **Roguelike元素**: 永久死亡、随机道具、技能组合

## 🏗️ 技术架构

### 技术栈
- **游戏引擎**: Cocos Creator 3.8.6
- **编程语言**: TypeScript
- **设计模式**: 单例模式、工厂模式、观察者模式、状态机模式
- **架构思想**: 组件化架构、模块化设计、数据驱动

### 项目结构
```
assets/
├── Scripts/                    # 游戏逻辑脚本
│   ├── Base/                  # 基础类
│   │   ├── Singleton.ts       # 单例模式基类
│   │   └── EntityManager.ts   # 实体管理器基类
│   ├── Common/                # 公共接口和类型定义
│   ├── Enum/                  # 枚举定义
│   │   └── index.ts          # 事件、状态、路径等枚举
│   ├── Entity/                # 实体系统
│   │   ├── Actor/            # 角色系统
│   │   ├── Enemy/            # 敌人系统
│   │   ├── Weapon/           # 武器系统
│   │   ├── Bullet/           # 子弹系统
│   │   └── Material/         # 材料系统
│   ├── Factory/               # 工厂模式
│   ├── Global/                # 全局管理器
│   │   ├── EventManager.ts   # 事件管理器
│   │   ├── DataManager.ts    # 数据管理器
│   │   ├── ResourceManager.ts # 资源管理器
│   │   └── UIManager.ts      # UI管理器
│   ├── Scene/                 # 场景管理
│   ├── UI/                    # 用户界面
│   └── Util/                  # 工具类
├── resources/                 # 游戏资源
│   ├── config/               # 配置文件
│   ├── prefab/               # 预制体
│   ├── texture/              # 贴图资源
│   └── animation/            # 动画资源
└── Scene/                     # 场景文件
```

## 🎯 核心系统详解

### 1. 单例模式基类 (Singleton Pattern)

**文件**: `assets/Scripts/Base/Singleton.ts`

```typescript
/**
 * 单例模式基类
 * 确保全局只有一个实例，提供统一的访问点
 */
export default class Singleton {
    private static _instance: any = null;

    public static GetInstance<T>(): T {
        if (this._instance === null) {
            this._instance = new this();
        }
        return this._instance;
    }

    protected constructor() {}
}
```

**设计思路**:
- 使用静态变量保存唯一实例
- 提供统一的`GetInstance()`方法获取实例
- 构造函数设为protected，防止外部直接实例化
- 所有管理器都继承此类，确保全局唯一

### 2. 事件系统 (Event System)

**文件**: `assets/Scripts/Global/EventManager.ts`

```typescript
export default class EventManager extends Singleton {
    private map: Map<EventEnum, Array<IItem>> = new Map();

    // 注册事件监听
    public on(event: EventEnum, cb: Function, ctx: unknown) {
        if (this.map.has(event)) {
            this.map.get(event)!.push({ cb, ctx });
        } else {
            this.map.set(event, [{ cb, ctx }]);
        }
    }

    // 触发事件
    public emit(event: EventEnum, ...args: unknown[]) {
        if (this.map.has(event)) {
            this.map.get(event)!.forEach((item) => {
                item.cb.apply(item.ctx, args);
            });
        }
    }
}
```

**核心事件类型**:
```typescript
export enum EventEnum {
    ActorDamage = "ActorDamage",      // 角色受伤
    ActorCollect = "ActorCollect",      // 角色收集
    EnemyDamage = "EnemyDamage",      // 敌人受伤
    UIHPUpdate = "UIHPUpdate",        // UI更新血条
    UIEXPUpdate = "UIEXPUpdate",      // UI更新经验
    Restart = "Restart",                // 游戏重启
}
```

**系统优势**:
- 解耦模块间通信，降低依赖性
- 支持多监听器，一个事件可触发多个响应
- 类型安全，使用枚举定义事件名
- 全局统一管理，便于调试和维护

### 3. 角色系统 (Actor System)

**文件**: `assets/Scripts/Entity/Actor/ActorManager.ts`

角色管理器负责玩家角色的完整生命周期：

```typescript
@ccclass('ActorManager')
export class ActorManager extends EntityManager {
    public stats: ActorStats;           // 角色属性
    private stateMachine: ActorStateMachine;  // 状态机
    private weaponMap: Map<number, WeaponManager>;  // 武器管理器
    
    // 初始化流程
    public init(data: IActor): void {
        this.initData(data);            // 数据初始化
        this.initComponent(data);       // 组件初始化
        this.initState();               // 状态机初始化
        this.initWeapons(data.weaponList);  // 武器初始化
    }

    // 每帧更新
    public tick(dt: number): void {
        this.stateMachine.currentState?.tick(dt);   // 状态更新
        this.tickWeapons(dt);                        // 武器更新
    }
}
```

**角色属性系统**:
```typescript
export enum ActorStatsEnum {
    MaxHealth = "maxHealth",          // 最大生命值
    Damage = "damage",                // 基础伤害
    AttackSpeed = "attackSpeed",      // 攻击速度
    CritChance = "critChance",        // 暴击率
    Speed = "speed",                  // 移动速度
    Luck = "luck",                    // 幸运值
    Harvest = "harvest",              // 收获量
}
```

### 4. 武器系统 (Weapon System)

**核心设计**:
- **环绕攻击**: 武器围绕角色旋转，形成圆形攻击范围
- **多种类型**: 近战武器直接伤害，远程武器发射子弹
- **属性加成**: 武器伤害受角色属性影响

```typescript
// 武器环绕算法
private initWeapons(weapons: IWeapon[]) {
    for (const data of weapons) {
        const angle = (2 * Math.PI / weapons.length) * weapons.indexOf(data);
        const radius = 65;  // 环绕半径
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        weapon.setPosition(x, y);  // 设置环绕位置
    }
}
```

### 5. 状态机系统 (State Machine)

每个实体都有状态机管理不同行为状态：

```typescript
// 实体状态枚举
export enum EntityStateEnum {
    Idle = "Idle",      // 待机
    Move = "Move",      // 移动
    Damage = "Damage",    // 受伤
    Attack = "Attack",    // 攻击
    Dead = "Dead",      // 死亡
}
```

**状态机工作流程**:
1. **进入状态** (`enter()`) - 初始化状态相关数据
2. **执行状态** (`execute()`) - 每帧执行状态逻辑
3. **退出状态** (`exit()`) - 清理状态相关数据
4. **状态转换** - 根据条件切换到其他状态

### 6. 工厂模式 (Factory Pattern)

**文件**: `assets/Scripts/Factory/`

使用工厂模式统一管理游戏对象的创建：

```typescript
// ActorFactory - 创建角色实例
export class ActorFactory extends Singleton {
    public createActor(type: string): IActor {
        const config = this.getConfig(type);
        return {
            id: this.generateId(),
            type: type,
            position: { x: 0, y: 0 },
            weaponList: this.getInitialWeapons(type),
            ...config
        };
    }
}
```

**工厂模式优势**:
- 集中管理对象创建逻辑
- 便于添加新类型和修改属性
- 支持配置驱动，无需修改代码
- 提供统一的创建接口

### 7. 输入控制系统

**文件**: `assets/Scripts/UI/JoyStickManager.ts`

支持触摸和键盘双重输入：

```typescript
@ccclass('JoyStickManager')
export class JoyStickManager extends Component {
    public input: Vec2 = Vec2.ZERO;    // 输入向量
    
    // 触摸输入处理
    private onTouchMove(event: EventTouch): void {
        const touchPos = event.getUILocation();
        const stickPos = new Vec2(touchPos.x - this.body.position.x, touchPos.y - this.body.position.y);
        
        // 限制摇杆范围
        if (stickPos.length() > this.radius) {
            stickPos.multiplyScalar(this.radius / stickPos.length());
        }
        
        this.input = stickPos.clone().normalize();
    }
    
    // 键盘输入处理 (WASD)
    private updateStickByKeyboard(): void {
        let dir = new Vec2(0, 0);
        if (this.keyPressed['W']) dir.y += 1;
        if (this.keyPressed['A']) dir.x -= 1;
        if (this.keyPressed['S']) dir.y -= 1;
        if (this.keyPressed['D']) dir.x += 1;
        
        this.input = dir.normalize();
    }
}
```

## 📊 数据配置系统

### JSON配置文件

**角色配置** (`assets/resources/config/ActorConfig.json`):
```json
{
    "Actor01": {
        "name": "橘猫",
        "modifiers": [
            { "type": "StatModifier", "stat": "maxHealth", "value": 5, "description": "最大生命值+5" },
            { "type": "StatModifier", "stat": "speed", "value": 5, "description": "速度+5%" },
            { "type": "StatModifier", "stat": "harvest", "value": 8, "description": "收获+8" }
        ]
    }
}
```

**武器配置** (`assets/resources/config/WeaponConfig.json`):
```json
{
    "Weapon01": {
        "name": "木棍",
        "baseDamage": 3,
        "meleeAddDamage": 1,
        "attackInterval": 0.1,
        "attackRange": 200,
        "attackType": "Melee"
    }
}
```

## 🎮 游戏核心玩法

### 1. 战斗机制
- **环绕攻击**: 武器围绕角色旋转，接触敌人造成伤害
- **远程射击**: 发射子弹，直线飞行攻击远处敌人
- **暴击系统**: 根据暴击率造成额外伤害
- **属性加成**: 角色属性影响武器伤害和攻击速度

### 2. 升级系统
- **经验获取**: 击败敌人获得经验值
- **等级提升**: 经验值满后自动升级
- **属性强化**: 升级时选择强化某项属性
- **武器解锁**: 高等级解锁更强大的武器

### 3. 敌人系统
- **AI追踪**: 敌人自动追踪玩家位置
- **波次刷新**: 定时生成新的敌人群体
- **难度递增**: 随着时间推移，敌人数量和强度增加
- **掉落奖励**: 击败敌人掉落材料和道具

## 💡 代码设计亮点

### 1. 模块化架构
- **职责分离**: 每个系统负责单一功能
- **低耦合**: 系统间通过事件和接口通信
- **高内聚**: 相关功能集中在同一模块

### 2. 性能优化
- **对象池**: 重复使用子弹和敌人对象，减少GC压力
- **状态缓存**: 避免重复的状态检查和计算
- **资源预加载**: 游戏开始时加载所有必要资源

### 3. 扩展性设计
- **配置驱动**: 通过JSON配置文件定义游戏数据
- **工厂模式**: 新增游戏对象只需添加配置
- **状态机**: 新状态通过继承基类实现
- **事件系统**: 新功能通过事件通信集成

### 4. 类型安全
- **TypeScript**: 全程类型检查，减少运行时错误
- **枚举常量**: 避免魔法字符串，提高代码可读性
- **接口定义**: 明确数据结构和契约

## 🚀 开发指南

### 新增角色
1. 在`ActorConfig.json`中添加角色配置
2. 实现对应的`ActorModifier`类
3. 在`ActorFactory`中注册创建逻辑
4. 添加角色贴图和动画资源

### 新增武器
1. 在`WeaponConfig.json`中添加武器配置
2. 实现对应的`WeaponBehavior`类（近战/远程）
3. 在`WeaponFactory`中注册创建逻辑
4. 添加武器预制体和特效

### 新增敌人
1. 在`EnemyConfig.json`中添加敌人配置
2. 实现对应的`EnemyState`类
3. 在`EnemyFactory`中注册创建逻辑
4. 添加敌人贴图和AI行为

### 新增UI界面
1. 创建UI预制体
2. 继承`UIBase`类实现UI逻辑
3. 在`UIManager`中注册UI类型
4. 在`EventEnum`中添加相关事件

## 📈 总结

CatBro项目展示了一个完整的2D动作Roguelike游戏架构，通过合理运用设计模式和架构思想，实现了以下目标：

- **高内聚低耦合**: 各系统职责清晰，便于独立开发和测试
- **良好的扩展性**: 新功能可以通过配置和继承快速添加
- **优秀的性能**: 对象池、状态机等优化确保流畅运行
- **类型安全**: TypeScript提供完整的类型检查和智能提示

这个项目不仅是一个有趣的游戏，更是一个优秀的学习范例，展示了如何构建可维护、可扩展的游戏架构。无论是游戏开发新手还是有经验的开发者，都能从中获得宝贵的经验和启发。

---

**项目特色**: 可爱的猫咪主题 + 深度的策略玩法 + 流畅的战斗体验
**技术价值**: 完整的设计模式应用 + 优秀的代码架构 + 丰富的开发经验