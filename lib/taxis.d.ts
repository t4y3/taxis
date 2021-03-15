declare type Axis = {
    key: string;
    beginAt?: number;
    endAt?: number;
    duration: number;
    delay: number;
    position: string | number;
    progress: number;
    enter: boolean;
    pass: boolean;
};
declare type Axes = Map<string, Axis>;
declare type Option = {
    timeline?: HTMLElement;
};
export declare class Taxis {
    private readonly option;
    private axes;
    private beginAt;
    private requestID;
    private tickerFn;
    private timeline;
    get totalTime(): number;
    get totalTimeForTimeline(): number;
    get everyPassed(): boolean;
    constructor(option?: Option);
    restart(): void;
    getAxis({ key }: {
        key: any;
    }): Axis;
    getAxes(): Axis[];
    add(key: string, duration: number, delay?: number, position?: number | string): this;
    begin(): void;
    reset(): void;
    ticker(fn: (delta: number, axis: Axes) => void): void;
    private __tick;
    private calculation;
    private recalculation;
    private sort;
    private toMap;
}
export {};
