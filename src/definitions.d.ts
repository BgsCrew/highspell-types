export namespace Definitions {
    export interface ItemDefinition {
        ID: number;
        Name: string;
        NameCapitalized: string;
        Cost: number;
        IsStackable: boolean;
        IsTradeable: boolean;
        IsForMission: boolean;
        IsMembers: boolean;
    }

    export interface NPCDefinition {
        ID: number;
        Name: string;
        NameCapitalized: string;
        MoveEagerness: number;
        Combat: Combat;
        CanShop: boolean;
        Appearance: any; // Pk class
        CreatureAppearance: any; // bk class
    }

    export interface Combat {
        CombatLevel: number;
        CombatStyle: Enums.CombatStyle;
        AutoRetaliate: boolean;
        MovementSpeed: number;
        IsAggressive: boolean;
        AggroRadius: number;
        IsAlwaysAggro: boolean;
        Skills: Skill[]; // array of Skill objects
    }

    export interface Hitpoints extends Skill {
        OnReceivedDamageListener: Listener<(damage: number) => void>; // NI class
    }

    export interface Skill {
        OnExpChangeListener: Listener<(newExp: number) => void>; // NI class
        OnCurrentLevelChangeListener: Listener<(newLevel: number) => void>; // NI class
        OnLevelChangeListener: Listener<(newLevel: number) => void>; // NI class
        Level: number;
        CurrentLevel: number;
        XP: number;
    }

    export interface Listener<T extends (...args: any[]) => void> {
        Subscribe(callback: T): void;
        Unsubscribe(callback: T): void;
        Notify(...args: Parameters<T>): void;
    }

    export interface Bank {
        Type: Enums.MenuType;
        Items: BankItem[];
        IsWaitingForSwapItemConfirmation: boolean;
    }

    export interface BankItem extends Item {
    }

    export interface Quest {
        Def: QuestDefinition;
        CurrentCheckpoint: number;
        IsStarted: boolean;
        IsCompleted: boolean;
    }

    export interface QuestDefinition {
        ID: number;
        Name: string;
        Description: string;
        Reward: QuestReward;
        Checkpoints: QuestCheckpoint[];
    }

    export interface QuestReward {
        Exp: QuestExp[];
        ExtraRewardText: string[];
    }

    export interface QuestExp {
        Skill: Enums.Skill;
        _minAmount: number;
        _maxAmount: number;
        _bonusPerLevel: number;
    }

    export interface QuestCheckpoint {
        ID: number;
        Hint: string;
    }
}
