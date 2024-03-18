import {Express} from "express";
import {topicRoute} from "./topic.route";
import { songRoute } from "./song.route";
import {favoriteRoute} from "./favorite-song.route";
import {searchRoute} from "./search.route";
const clientRoutes = (app: Express): void => {
	app.use("/topics", topicRoute);
	app.use("/songs", songRoute);
	app.use("/favorite-songs", favoriteRoute);
	app.use("/search", searchRoute);
}

export default clientRoutes;
