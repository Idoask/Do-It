
import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    id: String,
    name: String,
    description: String,
    date: String,
    status: Number,
    usersLike: Array<{name:String,view:Boolean}>,
    subTasks: Array,
    expireDate: Date,
    user:String,
    files:Array<{name:String,url:String}>,
    comments:Array<{name:String,comment:String,view:Boolean}>

  })
export const TaskModel = mongoose.models.tasks || mongoose.model('tasks', TaskSchema);