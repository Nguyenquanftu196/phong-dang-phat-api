import express from 'express';
import bodyParser, { json } from 'body-parser';
import Routes from './routes';
import * as AuthCtrl from './controllers/auth';
import { initPassport } from './middlewares/passport';
import { initLogger } from './middlewares/logger';
import { initCORS } from './middlewares/cors';
import { initSecurity } from './middlewares/security';
import { initCtx } from './middlewares/context';
import { initIP } from './middlewares/ip';
import { initLanguages } from './middlewares/languages';
import { initHC } from './middlewares/healthcheck';
import { authenticateJWT } from './middlewares/passport';
import { NodeEnv } from './constants/server';
import { MySQLClient } from './clients/mysql';
import { getModels } from './models/db.tables';
import { UserController } from './controllers/users';
import { notFoundMiddleware, errorHandler } from './utils/errors';
import { ProductController } from './controllers/product'
import { CategoriesController } from './controllers/categories'

const compare = require('tsscmp');
const auth = require('basic-auth');

const app = express();

// Initialize models
getModels(MySQLClient);

app.get('/mysql', async (req, res) => {
  await MySQLClient.sync();
  res.json({ message: 'MySQL reset' });
});

app.use(express.static('../resources/image_product/:id'))

// Express configuration
app.set('trust proxy', process.env.USE_PROXY === 'true');

// Healthcheck
app.use('/healthcheck', initHC());

// Third party middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(initPassport());

// Custom middlewares
process.env.NODE_ENV !== NodeEnv.Test && app.use(initLogger());
app.use(initCORS());
app.use(initSecurity());
app.use(initCtx());
app.use(initIP());
app.use(initLanguages());

// Allow to generate anonymous JWT for new user
app.post('/auth/anonymous', AuthCtrl.anonymous);
app.get("/product", ProductController.list)
app.put("/view/product/:id", ProductController.viewAd)
app.get("/category", CategoriesController.list)

function check(name: any, pass: any) {
  var valid = true;

  valid = compare(name, 'root') && valid;
  valid = compare(pass, 'root') && valid;
  return valid;
}
const basicAuth = (req: any, res: any, next: any) => {
  const user = auth(req);
  if (!user || !check(user.name, user.pass)) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="example"');
    res.end('Access denied');
  } else {
    next();
  }
};

app.get('/admin/create', basicAuth, UserController.adminCreate);

// JWT verification
app.use(authenticateJWT());

// Routes
Routes(app);


app.get('/', (req, res) => res.send('Hello World'));

app.use(notFoundMiddleware);
app.use(errorHandler);

export default app;
