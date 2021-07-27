import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
// material
import {
  Table,
  Stack,
  Button,
  IconButton,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  Typography,
  TableContainer,
  TablePagination
} from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// components
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { useFormik, Form, FormikProvider } from 'formik';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import useWindowDimensions from '../utils/windowDimentions';
import TutorialDataService from '../utils/dataService';
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar } from '../components/_dashboard/user';
import { fDateTime } from '../utils/formatTime';
//
const schedule = require('node-schedule');
const _ = require('lodash');
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'task', label: 'Task', alignRight: false },
  { id: 'time', label: 'Time', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.task.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
  const { height } = useWindowDimensions();
  const h = height - 65 - 60 - 52;
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);

  const [taskId, setTaskId] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const notify = (msg) => {
    toast(`Hey Your task time has been over check out for ${msg}`);
  };
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = () => {
    TutorialDataService.getAll().once('value', onDataChange);
  };
  const onDataChange = (items) => {
    const TASKS = [];

    items.forEach((item) => {
      const data = item.val();
      // console.log(item.key);
      TASKS.push({
        key: item.key,
        task: data.task,
        time: data.time,
        completed: data.completed
      });
    });
    // schedule for tasks

    setTasks(TASKS);
    scheduleTasksNotification(TASKS);
    console.log('tasks', tasks);
  };

  const scheduleTasksNotification = (TASKS) => {
    console.log('scheduling notification');
    const jobNames = _.keys(schedule.scheduledJobs);
    for (const name of jobNames) schedule.cancelJob(name);
    let i = 0;
    for (i = 0; i < TASKS.length; i += 1) {
      // if (!TASKS[i].completed) {
      const msg = TASKS[i].task;
      const job = schedule.scheduleJob(TASKS[i].time, () => {
        console.log('The world is going to end today.');
        notify(msg);
      });
      console.log(job);
      // }
    }

    console.log(schedule.scheduledJobs);
  };

  const LoginSchema = Yup.object().shape({
    task: Yup.string().required('Email is required'),
    time: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      task: taskId ? selectedTask.task : '',
      time: taskId
        ? new Date(selectedTask.time).toISOString().slice(0, -5)
        : new Date().toISOString().slice(0, -5)
    },
    validationSchema: LoginSchema,
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      if (taskId === 0) {
        const data = {
          task: values.task,
          time: values.time,
          completed: false
        };

        TutorialDataService.create(data)
          .then(() => {
            fetchData();
            console.log('Created new item successfully!');
            handleClose();
            resetForm();
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        const data = {
          task: values.task,
          time: values.time,
          completed: selectedTask.completed
        };

        TutorialDataService.update(taskId, data)
          .then(() => {
            fetchData();
            console.log('upcate successfully!');
            handleClose();
            resetForm();
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tasks.map((n) => n);
      console.log(newSelecteds);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleClick = (event, id, row) => {
    const selectedIndex = selected.findIndex((item) => item.key === id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    console.log(event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const onDeleteButtonPress = (event) => {
    console.log(event);
    console.log(selected);
    const updates = {};
    let i = 0;
    for (i = 0; i < selected.length; i += 1) {
      updates[selected[i].key] = null; // setting value to null deletes the key
    }
    TutorialDataService.deleteSelected(updates)
      .then(() => {
        fetchData();
        setSelected([]);
        console.log('deleted');
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const markAsPending = (event) => {
    console.log(event);
    console.log(selected);
    const updates = {};
    let i = 0;
    for (i = 0; i < selected.length; i += 1) {
      updates[selected[i].key] = {
        task: selected[i].task,
        time: selected[i].time,
        completed: false
      }; // setting value to null deletes the key
    }
    TutorialDataService.deleteSelected(updates)
      .then(() => {
        fetchData();
        setSelected([]);
        console.log('deleted');
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const markAsDone = (event) => {
    console.log(event);
    console.log('marking as done', selected);
    const updates = {};
    let i = 0;
    for (i = 0; i < selected.length; i += 1) {
      updates[selected[i].key] = {
        task: selected[i].task,
        time: selected[i].time,
        completed: true
      }; // setting value to null deletes the key
    }
    TutorialDataService.deleteSelected(updates)
      .then(() => {
        fetchData();
        setSelected([]);
        console.log('deleted');
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const addTask = () => {
    handleClickOpen('add', 0);
    console.log('adding Task');
  };

  const editTask = (id) => {
    setTaskId(id.key);
    setSelectedTask(id);
    formik.setValues({
      task: id.task,
      time: new Date(id.time).toISOString().slice(0, -5)
    });
    console.log(selectedTask);

    handleClickOpen('edit', id.key);

    console.log('edit Task');
  };

  const handleClickOpen = (action, id) => {
    console.log(action);
    setTaskId(id);
    setOpen(true);
  };

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  // const handleSubmitF = () => {
  //   submitForm();
  // };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tasks.length) : 0;
  const filteredUsers = applySortFilter(tasks, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Tasks Plane">
      <Stack>
        <UserListToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          markAsDone={markAsDone}
          markAsPending={markAsPending}
          placeHolder="Search Task"
          buttonText="Add Task"
          buttonAction={addTask}
          deleteButtonAction={onDeleteButtonPress}
        />
        {/* <button onClick={notify}>Notify!</button> */}
        <ToastContainer
          position="top-right"
          autoClose={30000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
        />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }} style={{ height: h }}>
            <Table stickyHeader>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tasks.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { key, task, time, completed } = row;
                    const isItemSelected = selected.findIndex((item) => item.key === key) !== -1;
                    return (
                      <TableRow
                        hover
                        key={key}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            onChange={(event) => handleClick(event, key, row)}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                            <Typography variant="subtitle2" noWrap>
                              {task}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{fDateTime(time)}</TableCell>

                        <TableCell align="left">
                          <Label variant="ghost" color={completed ? 'success' : 'error'}>
                            {completed ? 'Completed' : 'Active'}
                          </Label>
                        </TableCell>

                        <TableCell align="right">
                          <>
                            <IconButton onClick={() => editTask(row)}>
                              <Icon icon={moreVerticalFill} width={20} height={20} />
                            </IconButton>
                          </>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={filterName} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={tasks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Stack>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <FormikProvider value={formik}>
          <Form autoComplete="off" id="my-form" noValidate onSubmit={handleSubmit}>
            <DialogTitle id="form-dialog-title">Manage Your Task</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Create a task in the system and set its time limit, the task should be completed. In
                any case it will be completed on the time scheduled.
              </DialogContentText>

              <Stack style={{ marginTop: 15 }} spacing={2}>
                <TextField
                  fullWidth
                  autoComplete="username"
                  type="text"
                  label="Task Details"
                  {...getFieldProps('task')}
                  error={Boolean(touched.task && errors.task)}
                  helperText={touched.task && errors.task}
                />

                <TextField
                  fullWidth
                  type="datetime-local"
                  shrink="true"
                  label="Scheduled On"
                  {...getFieldProps('time')}
                  error={Boolean(touched.time && errors.time)}
                  helperText={touched.time && errors.time}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button form="my-form" type="submit" color="primary">
                Save
              </Button>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </Page>
  );
}
