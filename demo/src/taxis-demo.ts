export class TaxisDemo extends HTMLElement {
  $boxes: NodeListOf<HTMLElement>;
  $timeline: HTMLElement;
  width: number;
  requestID: number;
  time: number;
  beginAt: number;
  resizeObserver: ResizeObserver;
  isIntersecting: boolean;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isIntersecting = false;
    this.shadowRoot.innerHTML = this.template();
    // Element
    this.$boxes = this.shadowRoot.querySelectorAll(".box");
    this.$timeline = this.shadowRoot.querySelector(".timeline");
  }

  attributeChangedCallback() {}

  connectedCallback() {
    setTimeout(() => {
      // Event
      this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
      this.resizeObserver.observe(this);
      this.beginAt = Date.now();
    }, 0);
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.requestID);
    this.resizeObserver.unobserve(this);
    // this.intersectionObserver.unobserve(this);
  }

  handleResize(entries) {
    const { width, height } = entries[0].contentRect;
    this.width = width;
  }

  // handleIntersection(entries) {
  //   const isIntersecting = entries[0].isIntersecting;
  //   if (this.isIntersecting && !isIntersecting) {
  //     cancelAnimationFrame(this.requestID);
  //   }
  //   if (!this.isIntersecting && isIntersecting) {
  //     this.render();
  //   }
  //   this.isIntersecting = isIntersecting;
  // }

  template() {
    return `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        .container {
        }
        .box {
          width: 60px;
          height: 60px;
          border-radius: 2px;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #545454, #333);
        }
        .box:last-child {
          margin-bottom: 0;
        }
        .timeline {
          margin-top: 20px;
          height: 200px;
        }
        img {
          width: 100%;
          margin-top: 12px;
        }
      </style>
      <div class="container">
        <div class="wrap">
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
        </div>
        <div class="timeline"></div>
        <img src="https://user-images.githubusercontent.com/9010553/111905765-b2864600-8a90-11eb-92e3-8bbe8927c2d7.png" alt="">
      </div>
    `;
  }

  start(fn) {
    fn(this.ticker.bind(this));
  }

  ticker(progresses) {
    this.$boxes.forEach((box, i) => {
      box.style.transform = `translateX(${
        progresses[i] * (this.width - 60)
      }px)`;
    });
  }

  render() {
    this.requestID = requestAnimationFrame(this.render.bind(this));
  }
}

window.customElements.define("taxis-demo", TaxisDemo);
