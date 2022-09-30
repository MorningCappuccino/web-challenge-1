//https://stackoverflow.com/questions/37233735/interfaces-vs-types-in-typescript
export type BubbleMoveParams = {
    readonly name: string;
    x: number;
    y: number;
};

export type BubbleMoveLeftParams = {
    deltaY: number;
};

export type Rgb = {
    r: number;
    g: number;
    b: number;
};
