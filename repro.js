import { connect } from 'node:net';
import Fastify from 'fastify';
import rateLimit from '@fastify/rate-limit';

const app = Fastify();
await app.register(rateLimit, { max: 5, timeWindow: 60_000 });
app.get('/', async () => 'ok');
const address = await app.listen({ host: '127.0.0.1', port: 0 });

try {
  const response = await new Promise((resolve, reject) => {
    const socket = connect({ host: '127.0.0.1', port: Number(new URL(address).port) });
    let data = '';
    socket.setEncoding('utf8');
    socket.setTimeout(5000, () => socket.destroy(new Error('Timed out')));
    socket.on('error', reject);
    socket.on('data', (chunk) => { data += chunk; });
    socket.on('end', () => resolve(data));
    socket.on('connect', () => {
      socket.write(
        'GET / HTTP/1.1\r\nHost: localhost\r\n\r\n'.repeat(5) +
        'GET / HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n'
      );
    });
  });
  console.log([...response.matchAll(/HTTP\/1\.1 (\d{3}) /g)].map((match) => Number(match[1])));
} finally {
  await app.close();
}
