import { Request, Response} from "express";

import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import Favorite from "../../models/favorite-song.model";
//[GET]/songs/:slugTopic
export const list = async (req: Request, res: Response) => {

	const topic = await Topic.findOne({
		slug: req.params.slugTopic,
		deleted: false
	});


	const songs = await Song.find({
		topicId: topic.id,
		status: "active",
		deleted: false
	}).select("title avatar singerId like createAt slug");

	for (const song of songs) {
		const infoSinger = await Singer.findOne({
			_id: song.singerId
		}).select("fullName");
		song['infoSinger'] = infoSinger;
	}

	res.render("client/pages/songs/list", {
		pageTitle: topic.title,
		songs: songs
	});
}

//[GET]/songs/detail/:slugSong
export const detail = async (req: Request, res: Response) => {
	const slugSong = req.params.slugSong;

	const song = await Song.findOne({
		slug: slugSong,
		status: "active",
		deleted: false
	});
	
	const singer = await Singer.findOne({
		_id: song.singerId,
		status: "active",
		deleted: false
	}).select("fullName");

	const topic = await Topic.findOne({
		_id: song.topicId,
		status: "active",
		deleted: false
	}).select("title");

	const favoriteSong = await Favorite.findOne({
		// user_id:
		songId: song.id
	});


	song["isFavorite"] = favoriteSong ? true : false;


	res.render("client/pages/songs/detail", {
		pageTitle: song.title,
		song: song,
		singer: singer,
		topic: topic, 
	})
}

//[GET]/songs/like/:typeLike/:idSong
export const like = async (req: Request, res: Response) => {

	const idSong = req.params.idSong;
	const typeLike = req.params.typeLike;

	const song = await Song.findOne({
		_id: idSong,
		status: "active",
		deleted: false
	});

	const newLike = typeLike == "like" ? song.like + 1 : song.like - 1;

	await Song.updateOne({
		_id: idSong
	}, {
		like: newLike
	});

	res.json({
		code: 200,
		message: "Thành công",
		like: newLike
	})
}


//[PATCH]/songs/favorite/:typeFavorite/:idSong
export const favorite = async (req: Request, res: Response) => {

	const idSong = req.params.idSong;
	console.log(idSong);
	const typeFavorite = req.params.typeFavorite;

	switch (typeFavorite) {
		case "favorite":
			const existFavoriteSong = await Favorite.findOne({
				songId: idSong
			});

			if(!existFavoriteSong) {
				const record = new Favorite({
					// user_id
					songId: idSong});
				await record.save();
			}
			
			break;
		case "disfavorite":
			await Favorite.deleteOne({
				songId: idSong
			});
			break;
		default:
			break;
	}

	res.json({
		code: 200,
		message: "Thành công",

	})
	
}


//[PATCH] /songs/listen/:idSong

export const listen = async (req:Request, res:Response) => {
	const idSong = req.params.idSong;
	const song = await Song.findOne({
		_id: idSong
	});

	const listen: number = song.listen + 1;

	await Song.updateOne({
		_id: idSong
	}, {
		listen: listen
	});

	const songNew = await Song.findOne({
		_id: idSong
	});

	res.json({
		code: 200,
		message: "Thành công",
		listen: songNew.listen
	})
}



