const { JSDOM } = require("jsdom");

JSDOM.fromURL("https://amadeus.kalybana.com/", { runScripts: "dangerously", resources: "usable" }).then(dom => {
  dom.window.console.log = (...args) => console.log("LOG:", ...args);
  dom.window.console.error = (...args) => console.error("ERROR:", ...args);
  dom.window.console.warn = (...args) => console.warn("WARN:", ...args);

  dom.window.addEventListener('error', (event) => {
    console.error("UNCAUGHT ERROR:", event.error);
  });
  dom.window.addEventListener('unhandledrejection', (event) => {
    console.error("UNHANDLED REJECTION:", event.reason);
  });

  setTimeout(() => {
    console.log("ROOT CONTENT LENGTH:", dom.window.document.getElementById('root').innerHTML.length);
  }, 3000);
}).catch(e => console.error("JSDOM ERROR:", e));
