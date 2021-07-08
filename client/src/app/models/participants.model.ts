import InstrumentsModel from "./instruments.model";
import UsersModel from "./users.model";

export default interface ParticipantsModel{
    userId:UsersModel,
    role:string,
    profile_img_src:string,
    username:string,
    instruments?: InstrumentsModel[]
}