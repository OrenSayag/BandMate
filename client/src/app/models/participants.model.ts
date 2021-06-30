import UsersModel from "./users.model";

export default interface ParticipantsModel{
    userId:UsersModel|string,
    role:string
}