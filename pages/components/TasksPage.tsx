import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import styles from "../../styles/Home.module.css";
import { MyAppBar } from "./AppBar";
import { Task, Tasks } from "./Tasks";

const statusMapper: Record<string, number> = {
  todo: 1,
  "in-progress": 2,
  done: 3,
};

export const TasksPage: NextPage = () => {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [status, setStatus] = useState<number>(1);
  const [tasksState, setTasksState] = useState<Task[]>([]);
  const [description, setDescription] = useState<string>("new task");
  const [name, setName] = useState<string>("task name");
  const [search, setSearch] = useState<string>("");
  const [taskToEdit, setTaskToEdit] = useState<Task>();
  const [date, setDate] = useState<Date | null>(new Date());
  const [subTasks, setSubTasks] = useState<string[]>([]);
  const [subTaskToAdd, setSubTaskToAdd] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:3000/api/tasks")
      .then((response) => response.json())
      .then((res) => setTasksState(res.data));
  }, []);

  const resetState = () => {
    setSubTasks([]);
    setSubTaskToAdd("");
    setDate(new Date());
  };

  const addTask = () => {
    const newTask: Task = {
      date: new Date().toDateString(),
      id: uuid(),
      description: description,
      name: name,
      subTasks: subTasks,
      status,
      usersLike: [],
      expireDate: date as Date,
      user: user.given_name + " " + user.family_name,
    };

    setTasksState([...tasksState, newTask]);
    fetch("http://localhost:3000/api/tasks", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(newTask),
    });
    resetState();
  };

  const addSubTask = () => {
    if (subTaskToAdd !== "" && !subTasks.includes(subTaskToAdd)) {
      setSubTasks([...subTasks, subTaskToAdd]);
      setSubTaskToAdd("");
    }
  };

  useEffect(() => {
    setSubTasks(taskToEdit?.subTasks || []);
  }, [taskToEdit]);

  const editTask = (id: string | undefined) => {
    if (id) {
      const newTask = {
        name: name,
        description: description,
        subTasks: subTasks,
        expireDate: date,
      };

      const newTasks = tasksState.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            ...newTask,
          };
        }
        return task;
      });

      fetch(`http://localhost:3000/api/editTask/${id}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(newTask),
      });
      setTasksState(newTasks as Task[]);
    }
  };

  const toggleLiek = (id: string) => {
    const tasks = tasksState.map((task) => {
      const users = task.usersLike?.map((like) => like.name);
      if (task.id === id) {
        const change = !users?.includes(user.name)
          ? [...(task.usersLike || []), { name: user.name, view: false }]
          : task.usersLike?.filter((like) => like.name !== user.name);
        fetch(`http://localhost:3000/api/editTask/${id}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify({ ...task, usersLike: change }),
        });

        return { ...task, usersLike: change };
      }
      return task;
    });
    setTasksState(tasks);
  };

  const removeTask = (id: string) => {
    fetch(`http://localhost:3000/api/removeTask/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });
    setTasksState(tasksState.filter((task) => task.id !== id));
  };

  const onDragEnd = useCallback(
    ({ draggableId, destination, reason, source }: any) => {
      if (reason === "DROP") {
        const taskId = draggableId.split("card-")[1]; //id of task
        const destinationStatus = destination["droppableId"];

        // const draggedCardId = draggableId.split("-")[1];
        // const newIndexOfCard = destination.index;
        let tasksCopy = [];
        fetch("http://localhost:3000/api/tasks")
          .then((response) => response.json())
          .then((res) => {
            tasksCopy = res.data;

            const newTask = {
              status: statusMapper[destinationStatus],
            };

            const newTasks = tasksCopy.map((task) => {
              if (task.id === taskId) {
                return {
                  ...task,
                  ...newTask,
                };
              }
              return task;
            });
            setTasksState(newTasks as Task[]);
            fetch(`http://localhost:3000/api/editTask/${taskId}`, {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              method: "PUT",
              body: JSON.stringify(newTask),
            });
          });
      }
    },
    []
  );

  const handleChangeDate = (newValue: Date | null) => {
    setDate(newValue);
  };

  const deleteSubTask = (task: string) => {
    const newSubTasks = subTasks.filter((subTask) => {
      return subTask !== task;
    });
    setSubTasks(newSubTasks);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.container}>
        <MyAppBar user={user} setTasksState={setTasksState} allTasks={tasksState}  setUser={setUser} setSearch={setSearch} />
        <Tasks
          user={user}
          removeTask={removeTask}
          setOpen={setOpen}
          setStatus={setStatus}
          search={search}
          tasks={tasksState}
          setTasksState={setTasksState}
          toggleLiek={toggleLiek}
          setTaskToEdit={setTaskToEdit}
          setOpenEditDialog={setOpenEditDialog}
          allTasks={tasksState}
        />
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          style={{ width: "100vw", height: "100vh" }}
          PaperProps={{ style: { width: "40vw", height: "40vh" } }}
        >
          <DialogTitle>Add New Task</DialogTitle>
          <DialogContent style={{ display: "flex", flexDirection: "column" }}>
            <TextField
              onChange={(event) => setName(event.target.value)}
              id="standard-basic"
              label="Name"
              variant="standard"
            />
            <TextField
              onChange={(event) => setDescription(event.target.value)}
              id="standard-basic"
              label="Description"
              variant="standard"
              style={{ paddingBottom: 20 }}
            />
            <DesktopDatePicker
              label="Expire Date"
              inputFormat="MM/dd/yyyy"
              value={date}
              onChange={handleChangeDate}
              renderInput={(params) => <TextField {...params} />}
            />
            <TextField
              id="subTask1"
              label="sub tasks"
              variant="standard"
              onChange={(event) => {
                setSubTaskToAdd(event.target.value);
              }}
            />
            <div style={{ display: "flex", flexDirection: "row" }}>
              {subTasks.map((task) => {
                return (
                  <Chip
                    label={task}
                    variant="outlined"
                    onDelete={() => {
                      deleteSubTask(task);
                    }}
                  />
                );
              })}
            </div>
            <Button onClick={addSubTask}>Add Sub Task</Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Discard</Button>
            <Button
              onClick={() => {
                setOpen(false);
                addTask();
              }}
            >
              Finish
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          style={{ width: "100vw", height: "100vh" }}
          PaperProps={{ style: { width: "40vw", height: "40vh" } }}
        >
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent style={{ display: "flex", flexDirection: "column" }}>
            <TextField
              onChange={(event) => setName(event.target.value)}
              defaultValue={taskToEdit?.name}
              id="standard-basic"
              label="Name"
              variant="standard"
            />
            <TextField
              onChange={(event) => setDescription(event.target.value)}
              defaultValue={taskToEdit?.description}
              id="standard-basic"
              label="Description"
              variant="standard"
              style={{ paddingBottom: 20 }}
            />
            <DesktopDatePicker
              label="Expire Date"
              inputFormat="MM/dd/yyyy"
              value={date}
              onChange={handleChangeDate}
              renderInput={(params) => <TextField {...params} />}
            />
            <TextField
              id="subTask1"
              label="sub tasks"
              variant="standard"
              onChange={(event) => {
                setSubTaskToAdd(event.target.value);
              }}
            />
            <div style={{ display: "flex", flexDirection: "row" }}>
              {subTasks.map((task) => {
                return (
                  <Chip
                    label={task}
                    variant="outlined"
                    onDelete={() => {
                      deleteSubTask(task);
                    }}
                  />
                );
              })}
            </div>
            <Button onClick={addSubTask}>Add Sub Task</Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Discard</Button>
            <Button
              onClick={() => {
                setOpenEditDialog(false);
                editTask(taskToEdit?.id);
              }}
            >
              Finish
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </DragDropContext>
  );
};
