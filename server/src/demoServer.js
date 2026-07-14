import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const users=[]; const records=new Map(); const refreshes=new Map();
const resources=['students','hostels','rooms','beds','payments','attendance','leaves','visitors','gatepasses','complaints','notices','events','inventory','staff','menus','invoices','settings'];
resources.forEach(x=>records.set(x,[]));
const token=user=>jwt.sign({sub:user.id,role:user.role},process.env.JWT_ACCESS_SECRET,{expiresIn:'15m'});
const safe=u=>({id:u.id,name:u.name,email:u.email,role:u.role,avatar:u.avatar,phone:u.phone,isEmailVerified:u.isEmailVerified});
const protect=(req,res,next)=>{try{const t=req.headers.authorization?.replace('Bearer ','');const p=jwt.verify(t,process.env.JWT_ACCESS_SECRET);const u=users.find(x=>x.id===p.sub);if(!u)throw Error();req.user=u;next()}catch{res.status(401).json({success:false,message:'Authentication required. Please sign in again.'})}};
const page=(items,req)=>{const q=(req.query.q||'').toLowerCase();const filtered=q?items.filter(x=>Object.values(x).some(v=>String(v||'').toLowerCase().includes(q))):items;return {success:true,data:filtered,pagination:{page:1,limit:20,total:filtered.length,pages:1}}};
export function startDemoServer(){const app=express();app.use(helmet());app.use(cors({origin:process.env.CLIENT_URL||'http://localhost:5173',credentials:true}));app.use(express.json());app.use(cookieParser());
app.get('/api/health',(req,res)=>res.json({success:true,status:'healthy',mode:'local-demo'}));
app.post('/api/auth/register',async(req,res)=>{const {name,email,password,role='admin'}=req.body;if(!name||!email||!password||password.length<8)return res.status(422).json({success:false,message:'Name, valid email, and an 8-character password are required.'});if(users.some(u=>u.email===email.toLowerCase()))return res.status(409).json({success:false,message:'Email already registered'});const u={id:randomUUID(),name,email:email.toLowerCase(),password:await bcrypt.hash(password,10),role,isEmailVerified:true,createdAt:new Date()};users.push(u);const r=randomUUID();refreshes.set(r,u.id);res.cookie('refreshToken',r,{httpOnly:true,sameSite:'lax'}).status(201).json({success:true,data:{user:safe(u),accessToken:token(u)}})});
app.post('/api/auth/login',async(req,res)=>{const u=users.find(x=>x.email===String(req.body.email||'').toLowerCase());if(!u||!await bcrypt.compare(req.body.password||'',u.password))return res.status(401).json({success:false,message:'Invalid email or password'});const r=randomUUID();refreshes.set(r,u.id);res.cookie('refreshToken',r,{httpOnly:true,sameSite:'lax'}).json({success:true,data:{user:safe(u),accessToken:token(u)}})});
app.post('/api/auth/refresh',(req,res)=>{const u=users.find(x=>x.id===refreshes.get(req.cookies.refreshToken));if(!u)return res.status(401).json({success:false,message:'Refresh session expired'});res.json({success:true,data:{user:safe(u),accessToken:token(u)}})});
app.post('/api/auth/logout',(req,res)=>{refreshes.delete(req.cookies.refreshToken);res.clearCookie('refreshToken').json({success:true})});app.get('/api/auth/me',protect,(req,res)=>res.json({success:true,data:safe(req.user)}));app.post('/api/auth/forgot-password',(req,res)=>res.json({success:true,message:'Local mode does not send email. Create a new account if needed.'}));
app.get('/api/dashboard',protect,(req,res)=>{const stats={};for(const [k,v] of records)stats[k.slice(0,-1)]=v.length;res.json({success:true,data:{stats,recent:[],occupancy:0}})});
resources.forEach(name=>{app.get(`/api/${name}`,protect,(req,res)=>res.json(page(records.get(name),req)));app.post(`/api/${name}`,protect,(req,res)=>{const row={...req.body,_id:randomUUID(),createdAt:new Date(),updatedAt:new Date()};records.get(name).unshift(row);res.status(201).json({success:true,data:row})});app.patch(`/api/${name}/:id`,protect,(req,res)=>{const rows=records.get(name),i=rows.findIndex(x=>x._id===req.params.id);if(i<0)return res.status(404).json({success:false,message:'Record not found'});rows[i]={...rows[i],...req.body,updatedAt:new Date()};res.json({success:true,data:rows[i]})});app.delete(`/api/${name}/:id`,protect,(req,res)=>{const rows=records.get(name),i=rows.findIndex(x=>x._id===req.params.id);if(i<0)return res.status(404).json({success:false,message:'Record not found'});rows.splice(i,1);res.status(204).end()})});
app.listen(process.env.PORT||5000,()=>console.log(`Local HostelOS API listening on ${process.env.PORT||5000}`));}
