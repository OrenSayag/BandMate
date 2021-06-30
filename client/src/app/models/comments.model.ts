export default interface CommentsModel{
    username:string,
    userId:string,
    text:string,
    postedOn:Date,
    likes?: string[],
}