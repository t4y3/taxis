import { TaxisTimeline } from "./timeline";

type Axis = {
  key: string;
  beginAt?: number; // TODO: delete
  endAt?: number; // TODO: delete
  duration: number;
  delay: number;
  position: string | number;
  progress: number;
  enter: boolean;
  pass: boolean;
};

type Axes = Map<string, Axis>;

type TimelineOption = {
  container: HTMLElement;
  debug: boolean;
}

type Option = {
  timeline?: TimelineOption;
};

const initialAxis: Axis = {
  key: "",
  beginAt: 0,
  endAt: 0,
  duration: 0,
  delay: 0,
  position: 0,
  progress: 0,
  enter: false,
  pass: false,
};

const Events = {
  ENTER: "enter",
  LEAVE: "leave",
  PASS: "pass",
} as const;

type EventName = typeof Events[keyof typeof Events];

export class Taxis {
  private axes: Axis[];
  private beginAt: number;
  private requestID: number;
  private tickerFn: (delta: number, axis: Axes) => void;
  private timeline: TaxisTimeline;

  get totalTime() {
    if (!this.axes.length) {
      return 0;
    }
    return Math.max(...this.axes.map((item) => item.endAt));
  }

  get totalTimeForTimeline() {
    return this.totalTime + 500;
  }

  get everyPassed() {
    return this.axes.every((item) => item.pass);
  }

  constructor(private readonly option: Option = {}) {
    this.axes = [];
  }

  restart() {
    this.beginAt = Date.now();
  }

  getAxis({ key }) {
    return this.axes.find((item) => item.key === key);
  }

  getAxes() {
    return this.axes;
  }

  // entered(key: string) {
  // }
  //
  // left(key: string) {
  // }
  //
  // passed(key: string) {
  // }

  add(
    key: string,
    duration: number,
    delay: number = 0,
    position?: number | string
  ) {
    let beginAt = this.totalTime + delay;
    if (position !== undefined) {
      if (Number.isFinite(position)) {
        beginAt = <number>position + delay;
      } else {
        const axis = this.getAxis({ key: position });
        beginAt = axis.endAt + delay;
      }
    } else {
      const last = this.axes[this.axes.length - 1];
      position = !!last ? last.key : 0;
    }

    this.axes.push({
      ...initialAxis,
      key,
      beginAt,
      endAt: beginAt + duration,
      duration,
      delay,
      position,
    });
    this.sort();
    return this;
  }

  begin() {
    // TODO: delete
    if (this.option.timeline) {
      this.timeline = new TaxisTimeline(this.axes, this.totalTimeForTimeline, this.option.timeline.debug);
      this.option.timeline.container.appendChild(this.timeline);
    }

    this.beginAt = Date.now();
    this.__tick();
  }

  reset() {
    cancelAnimationFrame(this.requestID);
  }

  ticker(fn: (delta: number, axis: Axes) => void) {
    this.tickerFn = fn;
  }

  private __tick() {
    let beginAt = this.beginAt;
    let elapsedTime = Date.now() - beginAt;
    let editing = false;
    if (this.option.timeline) {
      // TODO: thin out
      this.axes = this.recalculation(this.timeline.getAxes());
      const {
        beginAt: __beginAt,
        elapsedTime: __elapsedTime,
        editing: __editing,
      } = this.timeline.get(this.beginAt);
      beginAt = __beginAt;
      elapsedTime = __elapsedTime;
      editing = __editing;
    }

    this.beginAt = beginAt;

    // TODO: totalTimeを超えたらここの処理はする必要がない
    this.axes.forEach((item, i) => {
      const tick = elapsedTime - item.beginAt;
      const progress = Math.max(0, Math.min(tick / item.duration, 1));
      const enter = item.beginAt <= elapsedTime;
      const pass = item.endAt < elapsedTime;

      // // When passed through
      // if (pass && !item.pass) {
      //   // TODO
      // }
      // // When entered
      // if (enter && !item.enter) {
      //   // TODO
      // }
      // if (progress === 0 && 0 < item.progress) {
      //   // TODO
      // }
      item.progress = progress;
      item.enter = enter;
      item.pass = pass;
    });

    // TODO: change
    if (this.option.timeline && !editing) {
      this.timeline.update(elapsedTime, this.totalTimeForTimeline, this.axes);
    }
    this.tickerFn && this.tickerFn(elapsedTime, this.toMap(this.axes));
    this.requestID = requestAnimationFrame(this.__tick.bind(this));
  }

  private calculation() {
    const newAxes = [];
    for (let i = 0; i < this.axes.length; i++) {
      const axis = this.axes[i];
      let { key, duration, position, delay } = axis;
      const totalTime = Math.max(...newAxes.map((item) => item.endAt));

      let beginAt = totalTime + delay;

      if (position !== undefined) {
        if (Number.isFinite(position)) {
          beginAt = <number>position + delay;
        } else {
          const axis = this.getAxis({ key: position });
          beginAt = axis.endAt + delay;
        }
      } else {
        position = beginAt;
      }

      newAxes.push({
        ...initialAxis,
        key,
        beginAt: beginAt,
        endAt: beginAt + duration,
        duration,
        delay,
        position,
      });
    }
  }

  private recalculation(axes) {
    const newAxes = [];

    for (let i = 0; i < axes.length; i++) {
      const axis = axes[i];
      let { key, duration, position, delay } = axis;
      let totalTime = Math.max(...newAxes.map((item) => item.endAt));
      let beginAt = totalTime + delay;

      if (position !== undefined) {
        if (Number.isFinite(position)) {
          beginAt = <number>position + delay;
        } else {
          const axis = this.getAxis({ key: position });
          beginAt = axis.endAt + delay;
        }
      } else {
        position = beginAt;
      }

      newAxes.push({
        ...initialAxis,
        key,
        beginAt: beginAt,
        endAt: beginAt + duration,
        duration,
        delay,
        position,
      });
    }
    return newAxes;
  }

  private sort() {
    this.axes.sort((a, b) => {
      return a.beginAt - b.beginAt;
    });
  }

  private toMap(axes: Axis[]): Map<string, Axis> {
    const map = new Map();
    axes.forEach((axis) => {
      map[axis.key] = axis;
      map.set(axis.key, axis);
    });
    return map;
  }
}
