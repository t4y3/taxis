(()=>{var p=class extends HTMLElement{constructor(i,t,a=!0){super();this.editing=!1;this.attachShadow({mode:"open"}),this.axes=i,this.totalTime=t,this.debug=a,this.shadowRoot.innerHTML=this.template(i,t),this.$pane=this.shadowRoot.querySelector("#pane"),this.$timeline=this.shadowRoot.querySelector("#timeline"),this.$current=this.shadowRoot.querySelector("#current"),this.$progress=this.shadowRoot.querySelector("#progress"),this.$labels=this.shadowRoot.querySelectorAll(".label"),this.$bars=this.shadowRoot.querySelectorAll(".bar"),this.$barsBegin=this.shadowRoot.querySelectorAll(".begin"),this.$barsEnd=this.shadowRoot.querySelectorAll(".end"),this.$previous=this.shadowRoot.querySelector("#previous"),this.$playPause=this.shadowRoot.querySelector("#play-pause"),this.$next=this.shadowRoot.querySelector("#next"),this.playing=!0,this.previous=!1,this.next=!1,this.skip=-1,this.$previous.addEventListener("click",e=>{this.previous=!0}),this.$playPause.addEventListener("click",e=>{this.playing=!this.playing}),this.$next.addEventListener("click",e=>{this.next=!0});for(let e=0,n=this.$bars.length;e<n;e++){if(this.$bars[e].addEventListener("click",l=>{let o=l.currentTarget,h=Number(o.getAttribute("idx"));this.skip=h}),!this.debug)continue;let r=this.$barsBegin[e],d=this.$barsEnd[e];r.addEventListener("input",l=>{let o=Number(r.value);if(Number(this.$barsEnd[e].value)<o){l.preventDefault();return}if(Number.isFinite(this.axes[e].position))this.axes[e].position=o,this.axes[e].duration=this.axes[e].endAt-(this.axes[e].delay+this.axes[e].position);else{let h=this.axes.find(c=>c.key===this.axes[e].position);this.axes[e].delay=o-h.endAt,this.axes[e].duration=this.axes[e].endAt-(this.axes[e].delay+h.endAt)}}),d.addEventListener("input",l=>{let o=Number(d.value);if(o<Number(this.$barsBegin[e].value)){l.preventDefault();return}if(Number.isFinite(this.axes[e].position))this.axes[e].duration=o-(this.axes[e].position+this.axes[e].delay);else{let h=this.axes.find(c=>c.key===this.axes[e].position);this.axes[e].duration=o-h.endAt-this.axes[e].delay}})}this.$labels.forEach(e=>{e.addEventListener("click",n=>{let s=n.currentTarget,r=Number(s.getAttribute("idx"));this.skip=r})}),this.$current.addEventListener("input",e=>{this.editing=!0;let n=Number(this.$current.value);this.__updateProgressPosition(n),this.__updateBar(this.totalTime)}),this.$current.addEventListener("change",e=>{this.editing=!1})}attributeChangedCallback(){}connectedCallback(){}disconnectedCallback(){}getAxes(){return this.axes}get(i){let t=Date.now(),a=Number(this.$current.value),e=t-i;if(this.playing||(i=t-a,e=a),this.editing&&(i=t-a,e=a),-1<this.skip){let n=this.axes[this.skip];i=t-n.beginAt,e=n.beginAt,this.skip=-1}return this.previous&&(this.previous=!1,i=t,e=0),this.next&&(this.next=!1,i=t-this.totalTime,e=this.totalTime),{beginAt:i,elapsedTime:e,editing:this.editing}}update(i,t,a){this.axes=a,this.totalTime=t,this.$current.setAttribute("max",t),this.$current.value=i,this.__updateProgressPosition(i),this.__updateBar(t),this.debug&&this.__updateBarRange(t),this.__updateScale(t)}template(i,t){let a="",e="",n="";for(let s=0;s<i.length;s++){let r=i[s];a+=`<div class="row" id="row-${s}"><div class="label" idx="${s}">${r.key}</div></div>`;let d="";this.debug&&(d=`
          <input class="begin" type="range" min="0" max="0" step="10" value="${r.beginAt}">
          <input class="end" type="range" min="0" max="0" step="10" value="${r.endAt}">
        `),e+=`
        <div class="row">
          <div class="bar bar--${this.debug?"debug":"default"}" idx="${s}"></div>
          ${d}
        </div>`,this.debug}for(let s=0,r=Math.floor(t/1e3);s<r;s++)n+=`<div class="scale-label" style="--sec: ${s+1}">${s+1}s</div>`;return`
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
          position: relative;
        }
        .row input[type="range"] {
          position: absolute;
          inset: 0;
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
          height: 100%;
          background-color: #545454;
          opacity: .5;
          transform-origin: left;
          cursor: pointer;
          position: relative;
        }
        .bar.bar--debug::before {
          content: "";
          display: block;
          width: 6px;
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          margin: 4px;
          border-radius: 2px;
          background-color: darkgray;
        }
        .bar.bar--debug::after {
          content: "";
          display: block;
          width: 6px;
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          margin: 4px;
          border-radius: 2px;
          background-color: darkgray;
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
        .current input[type="range"] {
          height: var(--controls-height);
          width: 100%;
          background: transparent;
        }
        input.begin[type="range"],
        input.end[type="range"] {
          height: 100%;
          width: calc(100% + 12px);
          background: transparent;
          pointer-events: none;
          margin-left: -6px;
        }
        input.begin[type="range"]::-webkit-slider-thumb,
        input.end[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          pointer-events: auto;
          opacity: 0;   
          width: 12px;
          height: 100%;
          cursor: ew-resize;
        }
        input.begin[type="range"]::-moz-range-thumb,
        input.end[type="range"]::-moz-range-thumb {
          -webkit-appearance: none;
          appearance: none;
          pointer-events: auto;
          opacity: 0;   
          width: 12px;
          height: 100%;
          cursor: ew-resize;
        }
        input.begin[type="range"]::-webkit-slider-thumb {
          background: darkgreen;
          transform: translateX(50%);
        }
        input.begin[type="range"]::-moz-range-thumb {
          background: darkgreen;
          transform: translateX(50%);
        }
        input.end[type="range"]::-webkit-slider-thumb {
          background: indianred;
          transform: translateX(-50%);
        }
        input.end[type="range"]::-moz-range-thumb {
          background: indianred;
          transform: translateX(-50%);
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
            <div class="scale" id="scale" style="--total: ${t}">
              <div class="scale-s"></div>
              <div class="scale-100ms"></div>
              ${n}
            </div>
          </div>
        </div>
        <div id="pane" class="pane">
          <div class="head">
            <div class="rows">
              ${a}
            </div>
          </div>
          <div id="timeline" class="body">
            <div class="rows">
              ${e}
            </div>
          </div>
        </div>
        <div class="current">
          <input id="current" type="range" min="0" max="0" step="any" value="0">
        </div>
        <div id="progress" class="progress"></div>
      </div>
    `}__updateScale(i){let t=this.shadowRoot.querySelector(".test");t&&t.remove(),this.shadowRoot.querySelectorAll(".scale-label").forEach(s=>{s.remove()}),this.shadowRoot.querySelector(".scale").style.setProperty("--total",i);let e="";for(let s=0,r=Math.floor(i/1e3);s<r;s++)e+=`<div class="scale-label" style="--sec: ${s+1}">${s+1}s</div>`;let n=document.createElement("div");n.className="test",n.innerHTML=e,this.shadowRoot.querySelector(".scale").appendChild(n)}__updateProgressPosition(i){let t=this.$timeline.clientWidth,a=Math.min(i/this.totalTime,1)*t;this.$progress.style.transform=`translateX(${a}px)`}__updateBarRange(i){for(let t=0;t<this.$bars.length;t++){let a=this.axes[t];this.$barsBegin[t].setAttribute("max",i),this.$barsBegin[t].value=a.beginAt,this.$barsEnd[t].setAttribute("max",i),this.$barsEnd[t].value=a.endAt}}__updateBar(i){let a=this.$timeline.clientWidth/i;for(let e=0;e<this.$bars.length;e++){let n=this.axes[e],s=n.beginAt*a,r=(n.endAt-n.beginAt)*a;this.$bars[e].style.transform=`translateX(${s}px)`,this.$bars[e].style.width=`${r}px`,0<n.progress&&!n.pass?this.$bars[e].classList.add("bar--active"):this.$bars[e].classList.remove("bar--active")}}};window.customElements.define("taxis-timeline",p);var u={key:"",beginAt:0,endAt:0,duration:0,delay:0,position:0,progress:0,enter:!1,pass:!1};var b=class{constructor(i={}){this.option=i;this.axes=[]}get totalTime(){return this.axes.length?Math.max(...this.axes.map(i=>i.endAt)):0}get totalTimeForTimeline(){return this.totalTime+500}get everyPassed(){return this.axes.every(i=>i.pass)}restart(){this.beginAt=Date.now()}getAxis({key:i}){return this.axes.find(t=>t.key===i)}getAxes(){return this.axes}add(i,t,a=0,e){let n=this.totalTime+a;if(e!==void 0)Number.isFinite(e)?n=e+a:n=this.getAxis({key:e}).endAt+a;else{let s=this.axes[this.axes.length-1];e=s?s.key:0}return this.axes.push({...u,key:i,beginAt:n,endAt:n+t,duration:t,delay:a,position:e}),this.sort(),this}begin(){this.option.timeline&&(this.timeline=new p(this.axes,this.totalTimeForTimeline,this.option.timeline.debug),this.option.timeline.container.appendChild(this.timeline)),this.beginAt=Date.now(),this.__tick()}reset(){cancelAnimationFrame(this.requestID)}ticker(i){this.tickerFn=i}__tick(){let i=this.beginAt,t=Date.now()-i,a=!1;if(this.option.timeline){this.axes=this.recalculation(this.timeline.getAxes());let{beginAt:e,elapsedTime:n,editing:s}=this.timeline.get(this.beginAt);i=e,t=n,a=s}this.beginAt=i,this.axes.forEach((e,n)=>{let s=t-e.beginAt,r=Math.max(0,Math.min(s/e.duration,1)),d=e.beginAt<=t,l=e.endAt<t;e.progress=r,e.enter=d,e.pass=l}),this.option.timeline&&!a&&this.timeline.update(t,this.totalTimeForTimeline,this.axes),this.tickerFn&&this.tickerFn(t,this.toMap(this.axes)),this.requestID=requestAnimationFrame(this.__tick.bind(this))}calculation(){let i=[];for(let t=0;t<this.axes.length;t++){let a=this.axes[t],{key:e,duration:n,position:s,delay:r}=a,l=Math.max(...i.map(o=>o.endAt))+r;s!==void 0?Number.isFinite(s)?l=s+r:l=this.getAxis({key:s}).endAt+r:s=l,i.push({...u,key:e,beginAt:l,endAt:l+n,duration:n,delay:r,position:s})}}recalculation(i){let t=[];for(let a=0;a<i.length;a++){let e=i[a],{key:n,duration:s,position:r,delay:d}=e,o=Math.max(...t.map(h=>h.endAt))+d;r!==void 0?Number.isFinite(r)?o=r+d:o=this.getAxis({key:r}).endAt+d:r=o,t.push({...u,key:n,beginAt:o,endAt:o+s,duration:s,delay:d,position:r})}return t}sort(){this.axes.sort((i,t)=>i.beginAt-t.beginAt)}toMap(i){let t=new Map;return i.forEach(a=>{t[a.key]=a,t.set(a.key,a)}),t}};})();
//# sourceMappingURL=taxis.js.map
