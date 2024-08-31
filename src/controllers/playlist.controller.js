import{Playlist} from '../models/playlist.model.js'
import {User} from '../models/user.model.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    try {
        const {name, description} = req.body
        const userId = req.User._id;
    
        const playlist = new Playlist({
            name: name,
            description: description,
            owner: userId,
        })
        
        await playlist.save();

        return res
        .status(200)
        .json( new ApiResponse(201, "playlist created successfully", playlist))

    } catch (error) {
        throw new ApiError(500, "Error creating playlist", error)
    }
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    try {
        const {userId} = req.params
        
        const playlist = await Playlist.find({userId})

        return res
        .status(200)
        .json(new ApiResponse(200, "user playlist fatched successfuly", playlist))

    } catch (error) {
         throw new ApiError(500, "Error while get user plalist", error)
    }

})

const getPlaylistById = asyncHandler(async (req, res) => {
    try {
        const {playlistId} = req.params
       
        const playlist = await Playlist.findById({playlistId}).populate('video')
    
        if(!playlist){
            throw new ApiError(404, 'Playlist not found');
        }
    
        return res.status(200).json(new ApiResponse(200, 'Playlist fetched successfully', playlist));
    
    } catch (error) {
        throw new ApiError(500, "Error while get user plalist by Id", error)
    }
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    try {
        const {playlistId, videoId} = req.params
    
        const playlist = await Playlist.findById({playlistId})
    
        if(!playlist){
            throw new ApiError(404, "Playlist not found")
        }
    
        if(!playlist.video.includes(videoId)){
            playlist.video.push(videoId)
            await playlist.save();
        }

        return res.
        status(200).
        json(new ApiResponse(200, 'Video added to playlist successfully', playlist));

    } catch (error) {
        throw new ApiError(500, "Error while add video playlist", error)
    }
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    try {
        const {playlistId, videoId} = req.params
        
        const playlist = await Playlist.findById({playlistId});
    
        if(!playlist){
            throw new ApiError(404, 'Playlist not found');
        }
    
        playlist.video = playlist.videos.filter((vid) => vid.toString() !== videoId);
    
        await playlist.save();

        return res
        .status(200)
        .json(new ApiResponse(200, 'Video removed from playlist successfully', playlist));
   
    } catch (error) {
        throw new ApiError(500, "Error while remove video from playlist", error)
    }
})

const deletePlaylist = asyncHandler(async (req, res) => {
    try {
        const {playlistId} = req.params
        
        const playlist = await Playlist.findByIdAndDelete({playlistId})
    
        if(!playlist){
            throw new ApiError(404, 'Playlist not found')
        }

        return res
        .status(200)
        .json(new ApiResponse(200, 'Playlist deleted successfully' ));

    } catch (error) {
        throw new ApiError(500, "Error while deleting playlist", error)
    }
})

const updatePlaylist = asyncHandler(async (req, res) => {
    try {
        const {playlistId} = req.params
        const {name, description} = req.body
        
        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            {name, description},
            {new: true, runValidators: true}
        );
    
        if(!playlist){
            throw new ApiError(404, 'Playlist not found');
        }
    
        return res
        .status(200)
        .json(new ApiResponse(200, 'Playlist updated successfully', playlist));
    } catch (error) {
        throw new ApiError(500, "Error while updating playlist", error)
    }
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}