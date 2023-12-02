import express from "express";
import session from 'express-session';
import handlebars from "express-handlebars";
import MongoStore from 'connect-mongo';
import path from 'path';


import { __dirname } from './utils.js';
import { URI } from './db/mongodb.js';

import indexRouter from './routers/views/indexRouter.js';
import sessionRouter from './routers/api/sessionRouter.js';
import productRouter from './routers/api/productRouter.js';
import cartRouter from './routers/api/cartRouter.js';

const app = express();

const CODE = '12345qwerty';

app.use(session({
  secret: CODE,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: URI,
    mongoOptions: {},
    ttl: 120,
  }), 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, '../public')));

//Configuracion del motor handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'handlebars');

//
app.use('/', indexRouter);
//Rutas para las API
app.use('/api', productRouter);
app.use('/api', cartRouter);
app.use('/api', sessionRouter);

//Manejo de errores
app.use((error, req, res, next) => {
    const message = `Ocurrió un error inesperado: ${error.message}`;
    console.error(message);
    res.status(500).json({ message });
})

export default app;
