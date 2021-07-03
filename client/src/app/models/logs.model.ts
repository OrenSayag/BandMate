import CommentsModel from "./comments.model";
import InstrumentsModel from "./instruments.model";
import ContentCategory from "./tinyModels/content-category.model";
import UsersModel from "./users.model";

export default interface LogsModel{
    timeInMins:number,
    instruments?: InstrumentsModel[],
    categories?:ContentCategory[],
    title:string,
    ratingStars:number,
    users?: UsersModel|string[],
    // parentUser: UsersModel|string,
    parentUser: {profile_img_src:string, _id:string, participants:{userId:string}[], username:string},
    date: Date,
    comments: CommentsModel[],
    likes: string[],
    isPrivate: Boolean,
    type?:string,
    _id:string

}