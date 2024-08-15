import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    video: [
        {
            type: Schema.Types.ObjectId,
            ref: "video",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }

}, { timeseries: true })

export const Playlist = mongoose.model("Playlist", playlistSchema)