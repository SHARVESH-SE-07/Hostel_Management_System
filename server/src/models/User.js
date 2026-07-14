import mongoose from 'mongoose'; import bcrypt from 'bcryptjs';
const schema = new mongoose.Schema({ name:{type:String,required:true,trim:true}, email:{type:String,required:true,unique:true,lowercase:true,index:true}, password:{type:String,minlength:8,select:false}, role:{type:String,enum:['admin','student','warden','accountant','security','parent','staff'],default:'student'}, avatar:String, phone:String, isEmailVerified:{type:Boolean,default:false}, refreshTokens:[String], resetToken:String, resetExpires:Date, lastLogin:Date },{timestamps:true});
schema.pre('save', async function(){ if(this.isModified('password')) this.password=await bcrypt.hash(this.password,12); });
schema.methods.comparePassword=function(password){return bcrypt.compare(password,this.password)};
export default mongoose.model('User',schema);
