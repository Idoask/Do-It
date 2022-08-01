
import { getConnection } from './dbConnect';
import { TaskModel } from './models/task';



export default async function handler (req, res) {
  const { method } = req

  await getConnection()

  switch (method) {
    case 'GET':
      try {
        
        const tasks = await TaskModel.find({})
        res.status(200).json({ success: true, data: tasks })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'POST':
      try {
        
        const task = await TaskModel.create(req.body)
        res.status(201).json({ success: true, data: task })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}