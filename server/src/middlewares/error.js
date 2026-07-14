export const notFound=(req,res)=>res.status(404).json({success:false,message:`Route ${req.originalUrl} not found`});
export const errorHandler=(err,req,res,next)=>{console.error(err);res.status(err.status||500).json({success:false,message:err.message||'Internal server error',...(process.env.NODE_ENV==='development'&&{stack:err.stack})});};
