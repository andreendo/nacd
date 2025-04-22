const http = require('http');

const agent = new http.Agent();

agent.on('free', () => {});