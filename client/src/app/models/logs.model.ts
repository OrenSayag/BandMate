import CommentsModel from "./comments.model";
import InstrumentsModel from "./instruments.model";
import UsersModel from "./users.model";

export default interface LogsModel{
    timeInMins:number,
    instruments?: InstrumentsModel|string[],
    categories?:string[],
    title:string,
    ratingStars?:number,
    users?: UsersModel|string[],
    parentUser: UsersModel|string,
    date: Date,
    comments?: CommentsModel[],
    likes?: UsersModel|string[],
    isPrivate?: Boolean,
    type?:string

}