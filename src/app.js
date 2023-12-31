import cookieParser from "cookie-parser";
import session from "express-session"
import MongoStore from 'connect-mongo';
import express from "express";
import handlebars from "express-handlebars";
import { routerCarts } from "./routes/cart.router.js";
import { routerProductos } from "./routes/products.router.js";
import { routerVistaProductos } from "./routes/productos.vista.router.js";
import { routerVistaRealTimeProducts } from "./routes/realTimeProducts.vista.router.js";
import {routerUsers} from "./routes/users.router.js"
import { __dirname } from "./dirname.js"
import { Server } from "socket.io";
import ProductManager from "./DAO/ProductManager.js";
import { connectMongo } from './utils/connections.js';
import { routerVistaProducts } from "./routes/products.vista.router.js";
import { routerVistaCart } from "./routes/cart.vista.router.js";
import { viewsRouter } from "./routes/views.router.js"
import { loginRouter } from "./routes/login.router.js"

const app = express();
const port = 8080;

connectMongo();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());


app.use(
  session({
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://nacho98msjz:qEe9Xlt1qe1cIbjM@cluster0.5c700yk.mongodb.net/', ttl: 86400 * 7 }),
    secret: 'un-re-secreto',
    resave: true,
    saveUninitialized: true,
  })
);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use("/api/products", routerProductos);
app.use("/api/carts", routerCarts);
app.use("/vista/realtimeproducts", routerVistaRealTimeProducts);
app.use("/vista/cart", routerVistaCart);
app.use("/api/users",routerUsers);
app.use("/vista/products", routerVistaProducts)
app.use('/', viewsRouter);
app.use('/api/sessions', loginRouter);
app.get('*', (req, res) => {
  return res.status(404).json({
    status: "Error",
    msg: "page not found",
    data: {},
  })
});

const httpServer = app.listen(port, () => {
  console.log('Servidor escuchando en el puerto ' + port);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
const pm = new ProductManager();
  socket.on("new-product-created", (newProduct) => {
    const productList = pm.getProducts();
    var repeatcode =false;
    productList.forEach(product => {
      if(newProduct.code==product.code){
        repeatcode=true
      }
    });
      if (repeatcode) {
        socketServer.emit("repeat-code",repeatcode);
      }else{
        const productCreated = pm.addProduct(newProduct.title, newProduct.description, newProduct.price, newProduct.thumbnails, newProduct.code, newProduct.stock, newProduct.status,newProduct.category);
      if (productCreated) {
        const productList = pm.getProducts();
        socketServer.emit("products", productList);
      } else {
        socketServer.emit("products", productCreated);
      }
    
    }
  });
  socket.on("delete-product", async (idToDelete) => {
    pm.deleteProduct(idToDelete);
    socketServer.emit("delete-product-in-table", idToDelete);
  })
});