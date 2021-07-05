import CommentsModel from "./comments.model";
import InstrumentsModel from "./instruments.model";
import ContentCategory from "./tinyModels/content-category.model";

interface Comment{
    text:string,
    postedOn:string,
    likes?: string[],
    userId: string
}

export default interface Recording {
    fileSrc:string,
    mediaType:string,
    ratingStars:number,
    users?:string[],
    title?:string,
    parentUser:{profile_img_src:string, _id:string, participants:{userId:string}[], username:string},
    date:Date,
    comments:CommentsModel[],
    categories:ContentCategory[],
    instruments:InstrumentsModel[],
    likes:string[],
    isPrivate:boolean,
    type:string,
    _id:string

}