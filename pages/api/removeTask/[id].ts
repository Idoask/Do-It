
import { getConnection } from '../dbConnect';
import { TaskModel } from '../models/task';



export default async function handler (req, res) {
  const { method,query } = req
 const taskId=query.id;
  await getConnection()

  switch (method) {
    case 'DELETE':
      try {
        const tasks = await TaskModel.deleteOne({id:taskId},()=>{})
        res.status(200).json({ success: true, data: tasks })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}