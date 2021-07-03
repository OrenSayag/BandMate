export default interface CommentsModel{
    userId:{userId:string,username:string,profile_img_src:string},
    text:string,
    postedOn:Date,
    likes: string[],
    _id:string
}