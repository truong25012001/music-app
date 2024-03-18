import express , {Express} from "express";
import * as database from "./config/database";
import dotenv from "dotenv";
import clientRoutes from "./routes/client/index.route";
import adminRoutes from "./routes/admin/index.route";
import moment from "moment";
import { systemConfig } from "./config/system";
import path from "path";
import methodOverride from "method-override";
import bodyParser from "body-parser";

dotenv.config();
database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3001;

app.use(express.static(`${__dirname}/public`));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

clientRoutes(app);
adminRoutes(app);

// TinyMCE
app.use(
    "/tinymce",
    express.static(path.join(__dirname, "node_modules", "tinymce"))
);
// End TinyMCE

// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;



// App Local variable
app.locals.moment = moment;


app.listen(port, () => {
	console.log(`App listening on port ${port}`);
})