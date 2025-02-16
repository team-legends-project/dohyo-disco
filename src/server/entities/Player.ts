import { Schema, type } from "@colyseus/schema"

export interface PressedKeys {
    w: number,
    a: number,
    s: number,
    d: number;
}

export class Position extends Schema {
    @type("number") x: number = 0;
    @type("number") y: number = 0;
    @type("number") z: number = 0;
}

export class Player extends Schema {
    @type("string") name: string;
    @type("number") id: number = 0;
    @type("number") state: number = 0;
    @type(Position) position = new Position();

    pressedKeys: PressedKeys= {w: 0, a: 0, s: 0, d:0}
}

export enum CharState {
    Idle,
    WalkLeft,
    WalkRight,
    Mash
}

export class StateAnimation {
    state: CharState;
    anim: string;

    constructor(state: CharState, anim: string){
        this.state = state;
        this.anim = anim;
    }
}

export const CharStates: StateAnimation[] = [
    new StateAnimation(CharState.Idle, "Idle"),
    new StateAnimation(CharState.WalkLeft, "WalkLeft"),
    new StateAnimation(CharState.WalkRight, "WalkRight"),
    new StateAnimation(CharState.Mash, "Mash")
    //others
]