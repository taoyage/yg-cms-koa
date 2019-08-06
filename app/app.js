require('module-alias/register');
const Koa = require('koa');
const parser = require('koa-bodyparser');
const catchError = require('./middlewares/exception');
const correctHttp = require('./middlewares/correctHttp');
const InitManager = require('./core/init');

const app = new Koa();
const port = 3001;

app.use(catchError);
app.use(correctHttp);
app.use(parser());

// 入口
InitManager.initCore(app);

app.listen(port, () => {
  console.log(`listening to ${port}`);
});
