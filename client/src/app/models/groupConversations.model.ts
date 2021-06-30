export default interface GroupConversationsModel{
    userIds:string[],
    name:string,
    creationDate:Date,
    admins:[string],
    type:string
}