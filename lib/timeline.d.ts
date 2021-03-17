export declare class TaxisTimeline extends HTMLElement {
    axes: any;
    totalTime: number;
    debug: boolean;
    $pane: HTMLElement;
    $timeline: HTMLElement;
    $current: HTMLInputElement;
    $progress: HTMLElement;
    $labels: NodeListOf<HTMLElement>;
    $bars: NodeListOf<HTMLElement>;
    $barsBegin: NodeListOf<HTMLInputElement>;
    $barsEnd: NodeListOf<HTMLInputElement>;
    $previous: HTMLElement;
    $playPause: HTMLElement;
    $next: HTMLElement;
    playing: Boolean;
    previous: Boolean;
    next: Boolean;
    skip: number;
    private editing;
    constructor(axes: any, totalTime: any, debug?: boolean);
    attributeChangedCallback(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    getAxes(): any;
    get(beginAt: any): {
        beginAt: any;
        elapsedTime: number;
        editing: boolean;
    };
    update(time: any, totalTime: any, axes: any): void;
    template(axes: any, total: any): string;
    __updateScale(total: any): void;
    __updateProgressPosition(time: any): void;
    __updateBarRange(totalTime: any): void;
    __updateBar(totalTime: number): void;
}
