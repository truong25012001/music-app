import {Request, Response} from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { convertToSlug } from "../../helpers/convertToSlug";

//[GET] /search/:type

export const result = async (req: Request, res:Response) => {

	const keyword:string = `${req.query.keyword}`;
	const type:string = req.params.type;

	let newSong = [];

	if(keyword) {
		const keywordRegex = new RegExp(keyword, "i");
		
		const slugRegex = convertToSlug(keyword);
		const slug = new RegExp(slugRegex, "i");
		
		const songs = await Song.find({
			$or: [
				{
					title: keywordRegex
				}, 
				{
					slug: slug
				}
			]
		});

		if(songs.length > 0) {
			for (const song of songs) {
				const infoSinger = await Singer.findOne({
					_id: song.singerId
				})
				newSong.push({
                    id: song.id,
                    title: song.title,
                    avatar: song.avatar,
                    slug: song.slug,
                    like: song.like,
                    infoSinger: {
                        fullName: infoSinger.fullName
                    }
                });
			}
			// newSong = songs;
		}

	}



	switch (type) {
		case "suggest":
			res.json({
				code: 200,
				message:"Thành công",
				songs: newSong
			})
			break;
		case "result":
			res.render("client/pages/search/result", {
				pageTitle: `Kết quả : ${keyword}`,
				keyword: keyword,
				songs: newSong
			});
			break;
		default:
			res.json({
				code: 400,
				message:"Lỗi",
			})
			break;
	}

	


}