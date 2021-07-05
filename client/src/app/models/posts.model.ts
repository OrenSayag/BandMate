import CommentsModel from "./comments.model";

// interface Comment{
//     text:string,
//     postedOn:string,
//     likes?: string[],
//     userId: string
// }

export default interface PostModel {
    fileSrc:string,
    content:string,
    parentUser:{profile_img_src:string, _id:string, participants:{userId:string}[], username:string,},
    date:Date,
    comments:CommentsModel[],
    likes:string[],
    isPrivate:boolean,
    type:string,
    mediaType: string,
    _id:string
}