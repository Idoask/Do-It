import type { NextPage } from "next";
import { TasksPage } from "./components/TasksPage";

const statusMapper: Record<string, number> = {
  todo: 1,
  "in-progress": 2,
  done: 3,
};

const Home: NextPage = () => {
  return <>
    <TasksPage />
  </>;
};

export default Home;
