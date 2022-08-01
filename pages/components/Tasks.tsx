import AddIcon from "@mui/icons-material/Add";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Typography
} from "@mui/material";
import React, { FC } from "react";
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot
} from "react-beautiful-dnd";
import { TaskCard } from "./TaskCard";

// status 1 - todo
// status 2 - in progress
// status 3 - done

export interface Task {
  id: string;
  name: string;
  description: string;
  date: string;
  status: number;
  usersLike?: {name:string,view:boolean}[];
  subTasks?: string[];
  expireDate: Date;
  user:string,
  files?:{name:string,url:string}[],
  comments?:{name:string,comment:string,view:boolean}[]
}

const getTaskCards = (
  tasks: Task[]|any,
  props: TasksProps,
  status: number,
  removeTask: any,
  toggleLiek: any
) => {
  const openDialog = () => {
    props.setStatus(status);
    props.setOpen(true);
  };

  return (
    <Card
      key={status}
      style={{
        backgroundColor: "#ebecf0",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        maxHeight: "70vh",
        maxWidth: "45vw",
        overflowY: "scroll",
      }}
    >
      <CardHeader
        title={status === 1 ? "todo" : status === 2 ? "in progress" : "done"}
      />
      <Divider />
      {<CardContent>
        {tasks
          .filter((task) => task.name.includes(props.search))
          .map((task: any, index: number) => {
            if (task.status === status) {
              return (
                <TaskCard
                  user={props.user}
                  removeTask={props.removeTask}
                  toggleLiek={props.toggleLiek}
                  task={task}
                  allTasks={props.allTasks}
                  key={index}
                  setTaskToEdit={props.setTaskToEdit}
                  setOpenEditDialog={props.setOpenEditDialog}
                  setTasksState={props.setTasksState}
                ></TaskCard>
              );
            }
          })}
      </CardContent>}

      {props.user!==null &&
      (<CardActions style={{ width: "100%" }}>
        <IconButton onClick={() => openDialog()}>
          <AddIcon />
          <Typography>Add a Card</Typography>
        </IconButton>
      </CardActions>)}
    </Card>
  );
};

interface TasksProps {
  setOpen: (open: boolean) => void;
  setStatus: (status: number) => void;
  tasks: Task[];
  removeTask: any;
  toggleLiek: any;
  search: string;
  setTasksState:(tasks:Task[])=>void;
  setTaskToEdit: (task: Task) => void;
  setOpenEditDialog: (open: boolean) => void;
  allTasks:Task[]
  user:any;
}

export const Tasks: FC<TasksProps> = (props) => {
  const [winReady, setwinReady] = React.useState(false);

  React.useEffect(() => {
    setwinReady(true);
  }, []);

  return winReady ? (
    <Grid
      container
      spacing={2}
      display={"flex"}
      justifyContent={"center"}
      marginTop={10}
      style={{ backgroundColor: "rgba(0,0,0,0.1)", height: "75vh" }}
    >
      <Droppable droppableId="todo" >
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => {
          return (
            <Grid
              item
              minWidth={450}
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                backgroundColor: snapshot.isDraggingOver
                  ? "blue"
                  : "transparent",
              }}
            >
              {getTaskCards(
                props.tasks,
                props,
                1,
                props.removeTask,
                props.toggleLiek
              )}
            </Grid>
          );
        }}
      </Droppable>

      <Droppable droppableId="in-progress"  >
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <Grid
            item
            minWidth={450}
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              backgroundColor: snapshot.isDraggingOver ? "blue" : "transparent",
            }}
          >
            {getTaskCards(props.tasks, props, 2,   props.removeTask,
                props.toggleLiek)}
          </Grid>
        )}
      </Droppable>

      <Droppable droppableId="done" >
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <Grid
            item
            minWidth={"450px"}
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              backgroundColor: snapshot.isDraggingOver ? "blue" : "transparent",
            }}
          >
            {getTaskCards(props.tasks, props, 3,props.removeTask,
                props.toggleLiek)}
          </Grid>
        )}
      </Droppable>
    </Grid>
  ) : null;
};
