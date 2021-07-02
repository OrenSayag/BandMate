import InstrumentsModel from "../instruments.model";
import ParticipantsModel from "../participants.model";
import UsersModel from "../users.model";


export default interface UserInfoModel{
    bands?: UsersModel[],
    fname:string,
    lname:string,
    id:string,
    instruments:InstrumentsModel[],
    isBand:boolean,
    mail:string,
    participants?:ParticipantsModel[],
    username:string,
    profile_img_src:string,
    cover_img_src:string,
    bio:string,

}