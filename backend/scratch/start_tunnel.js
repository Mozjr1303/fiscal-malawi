const localtunnel = require('localtunnel');

(async () => {
  const tunnel = await localtunnel({ port: 5000, subdomain: 'four-mugs-vanish' });

  console.log('--- TUNNEL STARTED ---');
  console.log(`URL: ${tunnel.url}`);
  console.log('--- ---');

  tunnel.on('close', () => {
    console.log('Tunnel closed');
  });
})();
