import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachmentIcon from "@mui/icons-material/Attachment";
import CommentIcon from "@mui/icons-material/Comment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  Divider,
  Menu,
  MenuItem,
  Stack,
  TextField
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import { deepPurple, red } from "@mui/material/colors";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { FC, useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import CheckList  from "./CheckList";
import  LinearWithValueLabel from "./LinearProgressWithLabel";
import { Task } from "./Tasks";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const style = {
  width: "100%",
  maxWidth: 360,
  bgcolor: "background.paper",
};

const upload = async (
  formData: FormData,
  setFiles: (fileUrls: { name: string; url: string }[]) => void,
  fileUrls: { name: string; url: string }[],
  name: string,
  id: string
) => {
  const data = await fetch(
    "https://api.cloudinary.com/v1_1/dwiua3ncp/image/upload",
    {
      method: "POST",
      body: formData,
    }
  ).then((r) => r.json());

  setFiles([...fileUrls, { name: name, url: data.secure_url }]);
  const newTask = {
    files: [...fileUrls, { name: name, url: data.secure_url }],
  };

  fetch(`/api/editTask/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(newTask),
  });
};

const StyledShareDialog = styled(Dialog)`
  .MuiPaper-root {
    width: 500px;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface TaskCardProps {
  task: Task;
  removeTask: (id: string) => void;
  toggleLiek: (id: string) => void;
  setTaskToEdit: (task: Task) => void;
  setOpenEditDialog: (open: boolean) => void;
  user: any;
  setTasksState:(tasks:Task[])=>void
  allTasks:Task[]
  //   newStatus: number;
  //   moveCard:(task:Task,newStatus:number)=>void
}

const TaskCard: FC<TaskCardProps> = (props) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [expanded, setExpanded] = React.useState(false);
  const [checked, setChecked] = React.useState([0]);
  const [files, setFiles] = useState<{ name: string; url: string }[]>(
    props.task&&props.task.files?props.task.files : []
  );
  const [comments, setComments] = useState<{name:string,comment:string,view:boolean}[]|undefined>(props.task&&props.task.comments?props.task.comments:undefined);
  const [newComments, setNewComments] = useState<any>([]);
  const progress =
  props.task&&props.task.subTasks !== undefined
      ? (checked.length / props.task.subTasks.length) * 100
      : 100;

  useEffect(() => {}, [props.user, props.task]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [menuRef, setMenuRef] = useState(null);
  const open = !!menuRef;

  const openMenu = (event: any) => setMenuRef(event.currentTarget);
  const closeMenu = () => setMenuRef(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [comment, setComment] = useState<{name:string,comment:string,view:boolean}|null>(null);

  const addComment = () => {
    if (comment !== null&&comments !== undefined) {
      
      setComments([...comments, comment]);
      fetch(`/api/editTask/${props.task.id}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({...props.task,comments:[...comments, comment]}),
      });
      const newTasks = props.allTasks.map(t=>{
        if(props.task&&t.id===props.task.id){
          return{...props.task,comments:[...comments, comment]}
        }
        return t
      })
      props.setTasksState(newTasks)
      setNewComments([...newComments, comment.comment]);
      setComment(null);
    }
  };

  const openNewCommentDialog = () => {
    setDialogOpen(true);
  };
  const closeNewCommentDialog = () => {
    setDialogOpen(false);
  };

  const toggleNewCommentDialog = () => {
    setNewComments([]);
    return dialogOpen ? closeNewCommentDialog() : openNewCommentDialog();
  };

  const uploadFile = async (
    files: FileList | null,
    setFiles: (fileUrl: { name: string; url: string }[]) => void,
    fileUrls: { name: string; url: string }[],
    taskId: string
  ) => {
    if (files) {
      const formData = new FormData();
      formData.append("upload_preset", "my-uploads");
      formData.append("file", files[0], files[0].name);
      upload(formData, setFiles, fileUrls, files[0].name, taskId);
    }
  };

  const likeTask=()=>{
    
  }

  return (
    <Draggable
      draggableId={`card-${props.task?props.task.id:'id'}`}
      index={Number(props.task?props.task.id:'id')}
    >
      {(provided, snapshot) => {
        const style = {
          backgroundColor: snapshot.isDragging ? "blue" : "white",
          fontSize: 18,
          ...provided.draggableProps.style,
        };
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={style}
          >
            <Card
              style={{ marginTop: 10, minWidth: 455 }}
              sx={{ maxWidth: 345 }}
            >
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    {props.task&&props.task.user === undefined
                      ? "N"
                      : props.task.user.split(" ")[0][0] +
                        props.task.user.split(" ")[1][0]}
                  </Avatar>
                }
                action={
                  <>
                    {props.task&&props.user !== null&&props.user.name===props.task.user && (
                      <IconButton onClick={openMenu} aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    )}
                    <Menu anchorEl={menuRef} open={open} onClose={closeMenu}>
                      {[
                        {
                          label: "remove",
                          onClick: () => {
                            closeMenu();
                            props.removeTask(props.task.id);
                          },
                        },
                        {
                          label: "edit",
                          onClick: () => {
                            props.setTaskToEdit(props.task);
                            props.setOpenEditDialog(true);
                          },
                        },
                      ].map((option) => {
                        return (
                          <MenuItem key={option.label} onClick={option.onClick}>
                            {option.label}
                          </MenuItem>
                        );
                      })}
                    </Menu>
                  </>
                }
                title={props.task.name}
                subheader={props.task.date}
              />

              <CardContent
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  checked={(progress === 100||props.task.subTasks?.length===0) && props.task.status === 3}
                  disabled
                />
                <Typography variant="body2" color="text.secondary">
                  {props.task.description}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                {props.user !== null && (
                  <>
                    <IconButton
                      onClick={() => toggleNewCommentDialog()}
                      aria-label="add to favorites"
                    >
                      <Badge
                        color="error"
                        badgeContent={
                          newComments === [] ? null : newComments.length
                        }
                      >
                        <CommentIcon />
                      </Badge>
                    </IconButton>
                    <IconButton
                      onClick={() => props.toggleLiek(props.task.id)}
                      aria-label="add to favorites"
                      color={props.task.usersLike?.map(like=>like.name)?.includes(props.user.name) ? "error" : undefined}
                    >
                      <FavoriteIcon />
                    </IconButton>
                    {props.user.name===props.task.user&&<IconButton
                      onClick={() => props.toggleLiek(props.task.id)}
                      aria-label="add to favorites"
                      component="label"
                    >
                      <input
                        onChange={(event) =>
                          uploadFile(
                            event.target.files,
                            setFiles,
                            files,
                            props.task.id
                          )
                        }
                        hidden
                        name="file"
                        accept="image/*"
                        type="file"
                      />
                      <AttachmentIcon />
                    </IconButton>}
                  </>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <AccessTimeIcon />
                  <Typography>
                    {new Date(props.task.expireDate).toDateString()}
                  </Typography>
                </div>
                {props.user !== null && (
                  <>
                    <IconButton
                      aria-label="share"
                      onClick={() => {
                        navigator.share({title:props.task.name,text:props.task.description,url:`/${props.task.id}`})     
                        // setShareDialogOpen(true);
                        // setShareUrl(`/${props.task.id}`);
                      }}
                    >
                      <ShareIcon />
                    </IconButton>
                  </>
                )}
                {(props.task.subTasks || (files && files.length > 0)) && (
                  <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                )}
              </CardActions>
              {dialogOpen && (
                <>
                  <Stack
                    direction={"row"}
                    gap={2}
                    sx={{ position: "relative" }}
                  >
                    <TextField
                      value={comment?comment.comment:''}
                      onChange={(e) => setComment({name:props.user.name,comment:e.target.value,view:false})}
                      fullWidth
                    />
                    <Button
                      sx={{ position: "absolute", right: 0, top: 0, bottom: 0 }}
                      variant="outlined"
                      onClick={addComment}
                    >
                      post
                    </Button>
                  </Stack>
                  <Typography variant="h6">Comments:</Typography>
                  <List dense={true}>
                    {comments && comments.map((comment, i) => (
                      <>
                      <ListItem style={{backgroundColor:'#6fb9d629'}} key={i}>
                        <Avatar style={{margin:5}} sx={{ bgcolor: deepPurple[500] }}>{comment.name.split(' ')[0][0]+comment.name.split(' ')[1][0]}</Avatar>
                        <ListItemText primary={comment.comment} />
                      </ListItem>
                      <Divider/></>
                    ))}
                  </List>
                </>
              )}
              {(props.task.subTasks || (files && files.length > 0)) && (
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  {files && files.length > 0 && (
                    <Typography variant="h6">Attachment:</Typography>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {files && files.length > 0 && (
                      <Card
                        style={{ width: "90%", backgroundColor: "aliceblue" }}
                      >
                        <CardContent>
                          <List
                            sx={style}
                            component="nav"
                            aria-label="mailbox folders"
                          >
                            {files.map((file) => {
                              return (
                                <>
                                <ListItem
                                  button
                                  onClick={(event) =>
                                    window.open(file.url, "_blank")
                                  }
                                >
                                  <ListItemText primary={file.name} />
                                </ListItem>
                                <Divider></Divider>
                                </>
                              );
                            })}
                          </List>
                          {/* {files.map((file) => {
                            return (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <IconButton
                                  onClick={(event) =>
                                    window.open(file.url, "_blank")
                                  }
                                >
                                  <InsertDriveFileIcon />
                                  <Typography>{file.name}</Typography>
                                </IconButton>
                                <Divider />
                              </div>
                            );
                          })} */}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  <CardContent>
                    {props.task.subTasks && props.task.subTasks.length > 0 && (
                      <LinearWithValueLabel value={progress} />
                    )}
                    <CheckList
                      subTasks={props.task.subTasks || []}
                      checked={checked}
                      setChecked={setChecked}
                    ></CheckList>
                  </CardContent>
                </Collapse>
              )}
            </Card>
            <StyledShareDialog open={shareDialogOpen}>
              <span>{shareUrl}</span>
              <Button
                onClick={() => {
                  
                  navigator.clipboard.writeText(shareUrl);
                  setShareDialogOpen(false);
                }}
                sx={{ marginTop: "20px" }}
              >
                Click here to copy URL
              </Button>
            </StyledShareDialog>
          </div>
        );
      }}
    </Draggable>
  );
};

export default TaskCard;