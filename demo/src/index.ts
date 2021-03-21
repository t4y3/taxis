import { Taxis } from "../../src/taxis";
import { TaxisDemo } from "./taxis-demo";

window.addEventListener("DOMContentLoaded", () => {

  const demo = new TaxisDemo();
  const taxis = new Taxis({
    timeline: {
      container: demo.$timeline,
      debug: true,
    },
  });
  demo.start((callback) => {
    taxis
      .add("box#01", 3 * 1000, 0)
      .add("box#02", 3 * 1000, -300)
      .add("box#03", 3 * 1000, -300);
    taxis.begin();
    taxis.ticker((time, axes) => {
      const progresses = [];
      axes.forEach((axis) => {
        progresses.push(axis.progress);
      });
      callback(progresses);
    });
  });
  document.querySelector(".timeline").appendChild(demo);

});
