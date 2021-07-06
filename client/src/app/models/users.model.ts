import GenresModel from "./genres.model";
import InstrumentsModel from "./instruments.model";
import ParticipantsModel from "./participants.model";

export default interface UsersModel{
    _id:string,
    username:string,
    fname?:string,
    lname?:string,
    mail?:string,
    hashedPass?:string,
    profile_img_src?:string,
    cover_img_src?:string,
    instruments?: InstrumentsModel|string[],
    followers?: string[],
    following?: string[],
    // bio: String,
    // recordings: [{
    //     type: ObjectId,
    //     ref:"recordings"
    // }],
    // posts: [{
    //     type: ObjectId,
    //     ref:"posts"
    // }],
    // logs: [{
    //     type: ObjectId,
    //     ref:"logs"
    // }],
    bands?: (UsersModel|string)[],
    genres?: (GenresModel|string)[],
    isBand?: Boolean,
    participants?: (ParticipantsModel|string)[],
    likedLogs?: string[],
    likedRecordings?: string[],
    likedPosts?: string[],
    logCategories?: {name:string, color:string}[],
    isAdmin?: Boolean,
}