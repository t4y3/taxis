export declare class TaxisDemo extends HTMLElement {
    $boxes: NodeListOf<HTMLElement>;
    $timeline: HTMLElement;
    width: number;
    requestID: number;
    time: number;
    beginAt: number;
    resizeObserver: ResizeObserver;
    intersectionObserver: IntersectionObserver;
    isIntersecting: boolean;
    constructor();
    attributeChangedCallback(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleResize(entries: any): void;
    template(): string;
    start(fn: any): void;
    ticker(progresses: any): void;
    render(): void;
}
