import jwt from 'jsonwebtoken';
export const accessToken=u=>jwt.sign({sub:u._id,role:u.role},process.env.JWT_ACCESS_SECRET,{expiresIn:process.env.ACCESS_TOKEN_TTL||'15m'});
export const refreshToken=u=>jwt.sign({sub:u._id},process.env.JWT_REFRESH_SECRET,{expiresIn:process.env.REFRESH_TOKEN_TTL||'7d'});
export const cookieOptions={httpOnly:true,secure:process.env.COOKIE_SECURE==='true',sameSite:'lax',path:'/api/auth'};
