export default interface MessageUnitModel{
        // userId:string,
        content: string;
        isJoinReq: boolean;
        from: {
            username: string,
            _id: string,
            profile_img_src:string,
            
        };
        to: {
            username: string,
            _id: string,
            profile_img_src:string,
            
        };
        status: string;
        date: Date;
        type: string;
        _id: string;
}