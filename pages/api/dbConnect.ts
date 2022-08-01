import mongoose from 'mongoose';

export const getConnection =()=>{
    try{
        const con=mongoose.connect(
            "mongodb+srv://admin:VYcgjZKhltEVwKLA@cluster0.bpvpxkj.mongodb.net/final?retryWrites=true&w=majority"
          );
        return con;
    }catch(err){
        
        throw err;
    }
}