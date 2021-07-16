import InstrumentsModel from "../instruments.model";
import LogsModel from "../logs.model";
import ParticipantsModel from "../participants.model";
import PostModel from "../posts.model";
import Recording from "../recordings.model";
import UsersModel from "../users.model";


export default interface UserInfoModel{
    bands: UsersModel[],
    fname:string,
    lname:string,
    _id:string,
    instruments:InstrumentsModel[],
    isBand:boolean,
    mail?:string,
    participants:ParticipantsModel[],
    username:string,
    profile_img_src:string,
    cover_img_src:string,
    bio:string,
    userFeed:Array<LogsModel|Recording|PostModel>,
    following: {
        _id:string,
        username:string,
        profile_img_src:string,
    }[],
    followers: {
        _id:string,
        username:string,
        profile_img_src:string,
    }[],
    joinReqsWithUsers: string[]
}