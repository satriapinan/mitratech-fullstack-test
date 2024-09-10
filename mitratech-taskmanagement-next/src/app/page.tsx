'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { CalendarIcon, Pencil2Icon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import axios from 'axios';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Task {
  _id: string;
  name: string;
  description: string;
  completed: boolean;
  priority: string;
  category: string;
  deadline: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    completed: false,
    priority: 'Medium',
    category: '',
    deadline: '',
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentViewTask, setCurrentViewTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get('/tasks');
      setTasks(response.data.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTaskDetails = async (taskId: string) => {
    try {
      const response = await axiosInstance.get(`/tasks/${taskId}`);
      setCurrentViewTask(response.data.data); // Set the task details for viewing
      setIsViewDialogOpen(true); // Open the view dialog
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleCreateTask = async () => {
    try {
      const response = await axiosInstance.post('/tasks', newTask);
      toast({
        title: 'Task Created',
        description: response?.data?.message || 'Task successfully created!',
      });
      resetForm();
      fetchTasks();
      setIsDialogOpen(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleUpdateTask = async () => {
    if (!currentTaskId) return;
    try {
      const response = await axiosInstance.put(
        `/tasks/${currentTaskId}`,
        newTask
      );
      toast({
        title: 'Task Updated',
        description: response?.data?.message || 'Task successfully updated!',
      });
      resetForm();
      fetchTasks();
      setIsDialogOpen(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDeleteTask = async (_id: string) => {
    try {
      const response = await axiosInstance.delete(`/tasks/${_id}`);
      toast({
        title: 'Task Deleted',
        description: response?.data?.message || 'Task successfully deleted!',
      });
      fetchTasks();
      setIsDialogOpen(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleEditTask = (task: Task) => {
    setIsEditing(true);
    setCurrentTaskId(task._id);
    setNewTask({
      name: task.name,
      description: task.description,
      completed: task.completed,
      priority: task.priority,
      category: task.category,
      deadline: task.deadline
        ? new Date(task.deadline).toISOString().substring(0, 10)
        : '',
    });
    setIsDialogOpen(true);
  };

  const handleViewTask = async (taskId: string) => {
    await fetchTaskDetails(taskId); // Fetch the task details by ID
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    setNewTask({
      ...newTask,
      deadline: selectedDate ? selectedDate.toISOString() : '',
    });
  };

  const handleApiError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        'An error occurred during the API request.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      console.error('API error:', errorMessage);
    } else {
      toast({
        title: 'Error',
        description: 'An unknown error occurred.',
        variant: 'destructive',
      });
      console.error('Unknown error:', error);
    }
  };

  const getPriorityChipStyle = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border border-red-500';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-500';
      case 'Low':
        return 'bg-green-100 text-green-800 border border-green-500';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-500';
    }
  };

  const getCategoryChipStyle = () => {
    return 'bg-gray-100 text-gray-700 border border-gray-300';
  };

  const getCompletionStyle = (completed: boolean) => {
    return completed
      ? 'text-green-600 font-semibold'
      : 'text-red-600 font-semibold';
  };

  const resetForm = () => {
    setNewTask({
      name: '',
      description: '',
      completed: false,
      priority: 'Medium',
      category: '',
      deadline: '',
    });
  };

  return (
    <div className="container m-auto p-6 flex flex-col justify-center min-h-[100vh]">
      <div className="text-center mb-5 text-gray-800">
        <h1 className="text-3xl font-bold">Manage Your Tasks.</h1>
        <p className="mt-1">
          &quot;Efficiently Manage Your Tasks, Unlock Your Full Productivity
          Potential&quot;
          <br />
          <span className="text-sm font-semibold">
            oleh Satria Pinandita Abyatarsyah
          </span>
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) resetForm();
            setIsDialogOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-lg shadow-md"
              onClick={() => {
                setIsEditing(false);
                setIsDialogOpen(true);
              }}
            >
              Create Task
            </Button>
          </DialogTrigger>

          <DialogContent className="shadow-lg rounded-lg bg-white max-h-[95vh] md:max-h-[90vh] md:max-w-[35vw] max-w-[90vw]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                {isEditing ? 'Update Task' : 'Create New Task'}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4 space-y-4 max-h-[65vh] overflow-y-auto">
              <div>
                <label className="block font-medium text-gray-700 mb-1 text-sm">
                  Task Name:
                </label>
                <Input
                  placeholder="Task Name"
                  value={newTask.name}
                  onChange={(e) =>
                    setNewTask({ ...newTask, name: e.target.value })
                  }
                  className="mb-2"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1 text-sm">
                  Description:
                </label>
                <Textarea
                  placeholder="Description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="mb-2"
                  rows={4}
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1 text-sm">
                  Deadline:
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <div>
                      <Button
                        variant={'outline'}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {newTask.deadline
                          ? format(new Date(newTask.deadline), 'MMMM d, yyyy')
                          : 'Pick a date'}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        newTask.deadline
                          ? new Date(newTask.deadline)
                          : undefined
                      }
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1 text-sm">
                  Completed:
                </label>
                <Select
                  onValueChange={(value) =>
                    setNewTask({
                      ...newTask,
                      completed: value === 'true',
                    })
                  }
                  value={newTask.completed ? 'true' : 'false'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select completed status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Not Completed</SelectItem>
                    <SelectItem value="true">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1 text-sm">
                  Priority:
                </label>
                <Select
                  onValueChange={(value) =>
                    setNewTask({ ...newTask, priority: value })
                  }
                  value={newTask.priority}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1 text-sm">
                  Category:
                </label>
                <Input
                  placeholder="Category"
                  value={newTask.category}
                  onChange={(e) =>
                    setNewTask({ ...newTask, category: e.target.value })
                  }
                  className="mb-2"
                />
              </div>
            </div>

            <DialogFooter className="flex flex-wrap justify-between items-center gap-2 md:px-4">
              {isEditing && (
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white md:mr-auto"
                  onClick={() => handleDeleteTask(currentTaskId!)}
                >
                  Delete Task
                </Button>
              )}
              {isEditing ? (
                <Button
                  className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
                  onClick={handleUpdateTask}
                >
                  Update Task
                </Button>
              ) : (
                <Button
                  className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
                  onClick={handleCreateTask}
                >
                  Create Task
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="shadow-lg rounded-lg bg-white max-h-[95vh] md:max-h-[90vh] md:max-w-[35vw] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Task Details
            </DialogTitle>
          </DialogHeader>
          {currentViewTask && (
            <div className="p-4 space-y-4 max-h-[65vh] overflow-y-auto">
              <Card className="shadow-none">
                <CardHeader className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {currentViewTask.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {currentViewTask.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-4">
                    <div
                      className={`flex w-fit px-3 py-1 h-fit rounded-full text-xs font-semibold ${getPriorityChipStyle(
                        currentViewTask.priority
                      )}`}
                    >
                      {currentViewTask.priority} Priority
                    </div>
                    <div
                      className={`flex w-fit h-fit px-3 py-1 rounded-full text-xs font-semibold ${getCategoryChipStyle()}`}
                    >
                      {currentViewTask.category}
                    </div>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm">
                      Deadline:{' '}
                      {format(
                        new Date(currentViewTask.deadline),
                        'MMMM d, yyyy'
                      )}
                    </p>
                    <p
                      className={getCompletionStyle(currentViewTask.completed)}
                    >
                      {currentViewTask.completed ? 'Complete' : 'Incomplete'}
                    </p>
                  </div>
                </CardHeader>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid px-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tasks.map((task) => (
          <Card
            key={task._id}
            className="flex flex-col justify-between align-center p-4 shadow-sm rounded-lg hover:shadow-md transition-shadow duration-300"
          >
            <CardHeader className="p-2 space-y-0">
              <span
                onClick={() => handleViewTask(task._id)}
                className="text-gray-500 text-xs hover:text-blue-500 hover:underline cursor-pointer"
              >
                See details
              </span>
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold text-gray-800">
                  {task.name}
                </h3>
                <span
                  onClick={() => handleEditTask(task)}
                  className="p-1 text-gray-500 hover:text-yellow-500 cursor-pointer"
                >
                  <Pencil2Icon className="w-5 h-5" />
                </span>
              </div>
              <div className="text-sm pt-3 max-h-24 overflow-y-auto">
                {task.description}
              </div>

              <div className="flex flex-wrap gap-1 pt-2">
                <div
                  className={`flex w-fit px-3 py-1 h-fit rounded-full text-xs font-semibold ${getPriorityChipStyle(task.priority)}`}
                >
                  {task.priority} Priority
                </div>
                <div
                  className={`flex w-fit h-fit px-3 py-1 rounded-full text-xs font-semibold ${getCategoryChipStyle()}`}
                >
                  {task.category}
                </div>
              </div>
            </CardHeader>
            <div className="flex justify-between align-center px-4 pt-4 text-sm text-gray-700">
              <p>{format(new Date(task.deadline), 'MMMM d, yyyy')}</p>
              <p className={getCompletionStyle(task.completed)}>
                {task.completed ? 'Complete' : 'Incomplete'}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
