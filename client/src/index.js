import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';
import Axios from 'axios';
import jquery from 'jquery';

const $ = jquery;

Axios.get('/api/clients').then((resp) => {
  let items = resp.data;

  let desiredConsole = window.location.hash?.substring(1);
  desiredConsole = items.find((item) => item.id.toLowerCase() === desiredConsole.toLowerCase());
  desiredConsole = desiredConsole || items[0];

  for(const item of resp.data) {
    const tab = $(`<div class="tab">${item.id}</div>`);

    if(desiredConsole.id === item.id) {
      tab.addClass('active');
    }

    tab.click(() => { location.href = "/#" + item.id; location.reload(); });

    $( ".tabs" ).append(tab);
  }

  const term = new Terminal({
    theme: {
      background: "transparent"
    },
    allowTransparency: true
  });
  const socket = new WebSocket(((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host + "/ws?id=" + desiredConsole.id);

  const fitAddon = new FitAddon();
  const attachAddon = new AttachAddon(socket);

  // Attach the socket to term
  term.loadAddon(fitAddon);
  term.loadAddon(attachAddon);

  term.open(document.getElementById('terminal'));

  fitAddon.fit();
  window.onresize = () => { fitAddon.fit() };
});
