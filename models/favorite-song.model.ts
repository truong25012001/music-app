import mongoose from "mongoose";

const favoriteSongSchema = new mongoose.Schema({
	//user_id
	songId: String,
	deleted: {
		type: Boolean,
		default: false
	},
	deletedAt: Date,
}, {
	timestamps: true
});

const Favorite = mongoose.model("Favorite", favoriteSongSchema, "favorite-songs");
export default Favorite;