var o=class extends HTMLElement{constructor(t,e){super();this.__dragging=!1;this.attachShadow({mode:"open"}),this.axes=t,this.shadowRoot.innerHTML=this.template(t,e),this.$pane=this.shadowRoot.querySelector("#pane"),this.$timeline=this.shadowRoot.querySelector("#timeline"),this.$current=this.shadowRoot.querySelector("#current"),this.$progress=this.shadowRoot.querySelector("#progress"),this.$labels=this.shadowRoot.querySelectorAll(".label"),this.$bars=this.shadowRoot.querySelectorAll(".bar"),this.$previous=this.shadowRoot.querySelector("#previous"),this.$playPause=this.shadowRoot.querySelector("#play-pause"),this.$next=this.shadowRoot.querySelector("#next"),this.playing=!0,this.previous=!1,this.next=!1,this.skip=-1,this.$previous.addEventListener("click",s=>{this.previous=!0}),this.$playPause.addEventListener("click",s=>{this.playing=!this.playing}),this.$next.addEventListener("click",s=>{this.next=!0}),this.$bars.forEach(s=>{s.addEventListener("click",r=>{let i=r.currentTarget,a=Number(i.getAttribute("idx"));this.skip=a})}),this.$labels.forEach(s=>{s.addEventListener("click",r=>{let i=r.currentTarget,a=Number(i.getAttribute("idx"));this.skip=a})}),this.$current.addEventListener("input",s=>{this.__dragging=!0;let r=Number(this.$current.value);this.__updateProgressPosition(r),this.__updateBar(r)}),this.$current.addEventListener("change",s=>{this.__dragging=!1})}attributeChangedCallback(){}connectedCallback(){}disconnectedCallback(){}get(t){let e=Date.now(),s=Number(this.$current.value),r=e-t;if(this.playing||(t=e-s,r=s),this.__dragging&&(t=e-s,r=s),-1<this.skip){let i=this.axes[this.skip];t=e-i.beginAt,r=i.beginAt,this.skip=-1}return this.previous&&(this.previous=!1,t=e,r=0),this.next&&(this.next=!1,t=e-this.totalTime,r=this.totalTime),{beginAt:t,elapsedTime:r,dragging:this.__dragging}}update(t,e,s){this.axes=s,this.totalTime=e,this.$current.setAttribute("max",e),this.$current.value=t,this.__updateProgressPosition(t),this.__updateBar(t)}template(t,e){let s="",r="",i="";for(let a=0;a<t.length;a++){let n=t[a];s+=`<div class="row" id="row-${a}"><div class="label" idx="${a}">${n.key}</div></div>`,r+=`<div class="row"><div class="bar" idx="${a}"></div></div>`}for(let a=0,n=Math.floor(e/1e3);a<n;a++)i+=`<div class="scale-label" style="--sec: ${a+1}">${a+1}s</div>`;return`
      <style>
        * {
          box-sizing: border-box;
        }
        :host {
          display: block;
          height: 100%;
        }
        .container {
          display: flex;
          flex-direction: column;
          height: 100%;
          background-color: #313131;
          color: #eeeeee;
          position: relative;
          --tools-height: 40px;
          --controls-height: 40px;
        }
        .tools {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          height: var(--tools-height);
          border-bottom: 1px solid #202020;
        }
        .tools__item {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          margin: 0 8px;
          color: #eeeeee;
        }
        .tools__item div {
          width: 100%;
          cursor: pointer;
        }
        .tools__item div:hover {
          opacity: .6;
        }
        .tools__item svg {
          fill: currentColor;
        }
        .controls {
          display: flex;
          flex-shrink: 0;
          height: var(--controls-height);
          border-bottom: 1px solid #202020;
        }
        .pane {
          display: flex;
          flex: 1;
          overflow: scroll;
          scroll-behavior: smooth;
        }
        .head {
          flex-shrink: 0;
          flex-basis: 20%;
          max-width: 200px;
          min-width: 0;
        }
        .body {
          flex: 1;
          position: relative;
        }
        .actions {
          height: 100%;
          border-right: 1px solid #222322;
        }
        .rows {
          border-right: 1px solid #222322;
        }
        .row {
          display: flex;
          align-items: center;
          height: 24px;
          border-bottom: 1px solid #202020;
        }
        .label {
          padding-left: 12px;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }
        .bar {
          width: 1px;
          height: 100%;
          background-color: #545454;
          opacity: .5;
          transform-origin: left;
          cursor: pointer;
        }
        .bar.bar--active {
          opacity: 1;
        }
        .progress {
          position: absolute;
          top: var(--tools-height);
          bottom: 0;
          left: 0;
          width: 2px;
          margin-left: min(20%, 200px);
          background-color: #71A0EB;
          opacity: 0.6;
        }
        .progress::before {
          content: "";
          display: block;
          width: 20px;
          height: 30px;
          background-color: #53aeff;
          margin-left: -9px;
        }
        .progress::after {
          content: "";
          display: block;
          border-top: 10px solid #53aeff;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          margin-left: -9px;
        }
        .current {
          position: absolute;
          top: var(--tools-height);
          height: var(--controls-height);
          left: -12px;
          right: -12px;
          margin-left: min(20%, 200px);
        }
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          margin: 0;
          cursor: pointer;
          outline: none;
          height: var(--controls-height);
          width: 100%;
          background: transparent;
        }
        input[type="range"]::-webkit-slider-thumb {
          opacity: 0;
        }
        input[type="range"]::-moz-range-thumb {
          opacity: 0;
        }
        /* Firefox\u3067\u70B9\u7DDA\u304C\u5468\u308A\u306B\u8868\u793A\u3055\u308C\u3066\u3057\u307E\u3046\u554F\u984C\u306E\u89E3\u6D88 */
        input[type="range"]::-moz-focus-outer {
          border: 0;
        }
        .scale {
          position: relative;
          height: 100%;
        }
        .scale-s,
        .scale-100ms {
          height: 50%;
        }
        .scale-s {
          /*
            total / 1s 
            e.g. 6000 / 1000
            x / 1000 = 6
            calc(100% / calc(var(--total) / 1000))
           */
          --x: calc(100% / calc(var(--total) / 1000));
          background: repeating-linear-gradient(90deg, transparent 0, transparent calc(var(--x) - 1px), #202020 calc(var(--x) - 1px), #202020 var(--x));
          border-bottom: 1px solid #202020;
        }
        .scale-100ms {
          --x: calc(100% / calc(var(--total) / 1000) / 10);
          background: repeating-linear-gradient(90deg, transparent 0, transparent calc(var(--x) - 1px), #202020 calc(var(--x) - 1px), #202020 var(--x));
        }
        .scale-label {
          --x: calc(100% / calc(var(--total) / 1000));
          position: absolute;
          top: 0;
          left: calc(var(--x) * var(--sec));
          font-size: 10px;
          font-style: italic;
          transform: translateX(calc(-100% - 4px));
        }
      </style>
      <div class="container">
        <div class="tools">
          <div class="tools__item">
            <div id="previous">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.75 20C2.75 20.5523 3.19772 21 3.75 21C4.30228 21 4.75 20.5523 4.75 20L4.75 4C4.75 3.44772 4.30229 3 3.75 3C3.19772 3 2.75 3.44772 2.75 4V20Z"/>
                <path d="M20.75 19.0526C20.75 20.4774 19.1383 21.305 17.9803 20.4748L7.51062 12.9682C6.50574 12.2477 6.54467 10.7407 7.5854 10.073L18.0551 3.35665C19.2198 2.60946 20.75 3.44583 20.75 4.82961L20.75 19.0526Z"/>
              </svg>
            </div>
          </div>
          <div class="tools__item">
            <div id="play-pause">
              <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <!-- Generator: Sketch 59.1 (86144) - https://sketch.com -->
                <title>ic_fluent_video_play_pause_24_filled</title>
                <desc>Created with Sketch.</desc>
                <g id="\u{1F50D}-Product-Icons" stroke="none" stroke-width="1" >
                    <g id="ic_fluent_video_play_pause_24_filled" fill-rule="nonzero">
                        <path d="M3.65140982,6.61646219 L11.1528787,11.3693959 C11.3672679,11.5052331 11.4827597,11.722675 11.4993749,11.9464385 L11.4984593,7.25 C11.4984593,6.83578644 11.8342458,6.5 12.2484593,6.5 L15.2484593,6.5 C15.6626729,6.5 15.9984593,6.83578644 15.9984593,7.25 L15.9984593,16.75 C15.9984593,17.1642136 15.6626729,17.5 15.2484593,17.5 L12.2484593,17.5 C11.8342458,17.5 11.4984593,17.1642136 11.4984593,16.75 L11.4993494,12.0597632 C11.4826318,12.2835468 11.3670166,12.5009613 11.1525249,12.6366956 L3.65105604,17.3837618 C3.15168144,17.6997752 2.5,17.3409648 2.5,16.75 L2.5,7.25 C2.5,6.65884683 3.15205264,6.30006928 3.65140982,6.61646219 Z M21.2477085,6.50037474 C21.661922,6.50037474 21.9977085,6.83616118 21.9977085,7.25037474 L21.9977085,16.7496253 C21.9977085,17.1638388 21.661922,17.4996253 21.2477085,17.4996253 L18.2477085,17.4996253 C17.8334949,17.4996253 17.4977085,17.1638388 17.4977085,16.7496253 L17.4977085,7.25037474 C17.4977085,6.83616118 17.8334949,6.50037474 18.2477085,6.50037474 L21.2477085,6.50037474 Z" id="\u{1F3A8}-Color"></path>
                    </g>
                </g>
              </svg>
            </div>
          </div>
          <div class="tools__item">
            <div id="next">
              <svg   viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 4C21 3.44772 20.5523 3 20 3C19.4477 3 19 3.44772 19 4V20C19 20.5523 19.4477 21 20 21C20.5523 21 21 20.5523 21 20V4Z"/>
                <path d="M3 4.94743C3 3.5226 4.61175 2.69498 5.7697 3.52521L16.2394 11.0318C17.2443 11.7523 17.2053 13.2593 16.1646 13.927L5.69492 20.6434C4.53019 21.3905 3 20.5542 3 19.1704V4.94743Z"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="controls">
          <div class="head"><div class="actions"></div></div>
          <div class="body">
            <div class="scale" id="scale" style="--total: ${e}">
              <div class="scale-s"></div>
              <div class="scale-100ms"></div>
              ${i}
            </div>
          </div>
        </div>
        <div id="pane" class="pane">
          <div class="head">
            <div class="rows">
              ${s}
            </div>
          </div>
          <div id="timeline" class="body">
            <div class="rows">
              ${r}
            </div>
          </div>
        </div>
        <div class="current">
          <input id="current" type="range" min="0" max="0" step="any" value="0">
        </div>
        <div id="progress" class="progress"></div>
      </div>
    `}__updateProgressPosition(t){let e=this.$timeline.clientWidth,s=Math.min(t/this.totalTime,1)*e;this.$progress.style.transform=`translateX(${s}px)`}__updateBar(t){let e=this.$timeline.clientWidth,s=Math.max(...this.axes.map(i=>i.endAt)),r=e/s;for(let i=0;i<this.$bars.length;i++){let a=this.axes[i],n=a.beginAt*r,c=(a.endAt-a.beginAt)*r;this.$bars[i].style.transform=`translateX(${n}px) scaleX(${c})`,0<a.progress&&!a.pass?this.$bars[i].classList.add("bar--active"):this.$bars[i].classList.remove("bar--active")}}};window.customElements.define("taxis-timeline",o);var l={key:"",beginAt:0,endAt:0,progress:0,enter:!1,pass:!1,tick:0};var _=class{get totalTime(){return Math.max(...this.__axes.map(t=>t.endAt))}get everyPassed(){return this.__axes.every(t=>t.pass)}constructor(t){this.__axes=[],this.__handlers={},this.__container=t.container}restart(){this.__beginAt=Date.now()}getAxis({key:t}){return this.__axes.find(e=>e.key===t)}getAxes(){return this.__axes}entered(t){return!!this.__entered.find(e=>e.key===t)}left(t){return!!this.__left.find(e=>e.key===t)}insert(t,e,s=0){return this.__axes.push({...l,key:t,beginAt:s,endAt:s+e}),this.__axes.sort((r,i)=>r.beginAt-i.beginAt),this}interval(t){let s=this.__axes[this.__axes.length-1].endAt;return this.__axes.push({...l,key:null,beginAt:s,endAt:s+t}),this}append(t,e,s=0){let i=this.__axes[this.__axes.length-1].endAt+s;return this.__axes.push({...l,key:t,beginAt:i,endAt:i+e}),this}parallel(){}begin(){this.__timeline=new o(this.__axes,this.totalTime),this.__container.appendChild(this.__timeline),this.__beginAt=Date.now(),this.__tick()}on(t,e){this.__handlers[t]||(this.__handlers[t]=[]),this.__handlers[t].push(e)}reset(){cancelAnimationFrame(this.requestID)}ticker(t){this.__ticker=t}__tick(){let{beginAt:t,elapsedTime:e,dragging:s}=this.__timeline.get(this.__beginAt);this.__beginAt=t;let r=[],i=[],a=[];this.__entered=[],this.__left=[],this.__axes.forEach((n,c)=>{let h=e-n.beginAt,x=n.endAt-n.beginAt,d=Math.max(0,Math.min(h/x,1)),p=n.beginAt<=e,g=n.endAt<e;g&&!n.pass,p&&!n.enter&&this.__entered.push(n),d===0&&0<n.progress&&this.__left.push(n),n.progress=d,n.enter=p,n.pass=g,n.tick=h}),s||this.__timeline.update(e,this.totalTime,this.__axes),this.__ticker&&this.__ticker(e,this.__axes),this.requestID=requestAnimationFrame(this.__tick.bind(this))}};export{_ as Taxis};
//# sourceMappingURL=index.js.map
