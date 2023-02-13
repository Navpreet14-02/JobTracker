const errorHandler = async (err,req,res,next)=>{
    const statusCode = res.statusCode?res.statusCode:500

    res.status(statusCode)
    res.json({
        success:false,
        message:err.message
    })
}

module.exports={errorHandler}