const fs = require('fs');
const path = require('path');

const events = fs.readFileSync(path.join(__dirname, 'plugins/socket/events.ts'), 'utf-8');

let registers = '';

for (const line of events.split('\n')) {
  if (!line.startsWith('export const ')) continue;
  const name = line.split(' ')[2];

  registers += '  socket.on(\'' + name + '\', (payload) =>\n';
  registers += '    callback(\'' + name + '\', events.' + name + ', socket, payload),\n';
  registers += '  );\n';
}

const content =
  'import { Socket } from \'socket.io-client\';\nimport * as events from \'./events\';\n\n' +
  'const callback = (\n  name: string, \n  func: (socket: Socket, payload: object) => object | null | void, \n  socket: Socket, \n  payload: object, \n) => {\n' +
  '  const ret = func(socket, payload);\n' +
  '  if (ret != null) socket.emit(name, ret);\n' +
  '};\n\n' +

  'export const register = (socket: Socket) => {\n' +
  registers +
  '};';

fs.writeFileSync(path.join(__dirname, 'plugins/socket/event-listener.ts'), content);