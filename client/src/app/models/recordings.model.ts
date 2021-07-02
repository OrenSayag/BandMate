interface Comment{
    text:string,
    postedOn:string,
    likes?: string[],
    userId: string
}

export default interface recordings {
    fileSrc:string,
    mediaType:string,
    ratingStars:number,
    users?:string[],
    title:string,
    parentUser:string,
    date:string,
    comment?:Comment[],
    likes?:string[],
    isPrivate:boolean,
    type:string

}