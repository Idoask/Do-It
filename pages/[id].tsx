import React, {useMemo} from 'react';
import {useRouter} from "next/router";
import { TasksPage } from "./components/TasksPage";
import { tasks } from './mocks/taskmock';
import { Button, Dialog, styled } from "@mui/material";

const StyledTaskDialog = styled(Dialog)`
  .MuiPaper-root {
    width: 500px;
    height: 500px;
  }
`;

const Task = (props) => {
  const { query, push } = useRouter();
  const idParam = query.id;

  const relevantTask = useMemo(() => {
    return tasks.filter(({id}) => {
      return id === idParam;
    })[0];
  }, [idParam]);

  return(
    <>
      <TasksPage />
      <StyledTaskDialog open={!!idParam}>
        <h1>{relevantTask?.name}</h1>
        <h2>{relevantTask?.description}</h2>
        <p>{relevantTask?.date}</p>
        <Button onClick={() => {
          push('/')
        }}>Close task</Button>
      </StyledTaskDialog>
    </>
  )
}

export default Task;