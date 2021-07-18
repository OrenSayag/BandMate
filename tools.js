const inBandValidator = async (bandId, id, res) => {
    if(bandId && (id!=bandId)){
        if(!user.bands.some(b=>b==bandId)){
  
          return res.status(400).send({"fail":"You're not in this band brother."})
        } else {
          return user = await UsersModel.findById(bandId)
        }
      }
}

if(bandId&&id!=bandId){
    await UsersModel.findByIdAndUpdate(
      bandId,
      {
        $push: {
          logCategories: { name: newCategory.name, color:newCategory.color },
        },
      }
    );
  } else {
    await UsersModel.findByIdAndUpdate(
      id,
      {
        $push: {
          logCategories: { name: newCategory.name, color:newCategory.color },
        },
      }
    );
  }