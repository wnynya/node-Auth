export default function (options) {
  const logger = options.logger;
  const blockChina = options.blockChina ? options.blockChina : false;
  return function (req, res, next) {
    // OPTIONS request
    if (req.method == 'OPTIONS') {
      next();
      return;
    }

    if (options['ignore-hosts'].includes(req.client.ip)) {
      next();
      return;
    }

    if (options['ignore-agents'].includes(req.client.agent.string)) {
      next();
      return;
    }

    // source
    let source = '';

    let country = req.headers['cf-ipcountry'];

    if (req?.client?.login) {
      source += req.client.id + '@';
    } else if (req?.client?.key) {
      source += req.client.id + '$';
    }

    source += req.client.ip;

    if (country) {
      source += ' (' + country + ')';
    }

    // protocol
    const protocol = req.socket.encrypted ? 'HTTPS' : 'HTTP';

    // method
    const method = req.method;

    // path
    const path = req.originalUrl;

    // document type
    const documentType = req.headers['sec-fetch-dest'] || 'none';

    // cookies
    let cookies = req.cookies;
    try {
      cookies = JSON.stringify(cookies);
    } catch (error) {}

    // client data
    const clientData = new Object();

    clientData.key = req.client.key ? req.client.key.id : undefined;

    // client data => referer
    clientData.referer = req.client.referer;

    // client data => agent
    clientData.agent = req.client.agent;

    let message = '';
    message += source + ' -> ' + protocol + ' ' + method + ' ' + path;
    message += ' -> ' + JSON.stringify(clientData);
    message += ' ' + documentType;

    if (blockChina && country == 'CN') {
      message = '[DROP]: ' + message;
      next = () => {
        res.status(500).end();
      };
    }

    logger.slog(message);

    next();
  };
}
