<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axiosInstance from '@/lib/axiosInstance';
import toast from 'vue-toastification';
import { format } from 'date-fns';
import { PencilIcon, CalendarIcon } from '@heroicons/vue/24/outline';
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import Dialog from '@/components/ui/dialog/Dialog.vue';
import Input from '@/components/ui/input/Input.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import Select from '@/components/ui/select/Select.vue';
import Popover from '@/components/ui/popover/Popover.vue';


interface Task {
  _id: string;
  name: string;
  description: string;
  completed: boolean;
  priority: string;
  category: string;
  deadline: string;
}

const tasks = ref<Task[]>([]);
const newTask = ref({
  name: '',
  description: '',
  completed: false,
  priority: 'Medium',
  category: '',
  deadline: '',
});
const isDialogOpen = ref(false);
const isViewDialogOpen = ref(false);
const isEditing = ref(false);
const currentTaskId = ref<string | null>(null);
const currentViewTask = ref<Task | null>(null);

const fetchTasks = async () => {
  try {
    const response = await axiosInstance.get('/tasks');
    tasks.value = response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

onMounted(fetchTasks);

const fetchTaskDetails = async (taskId: string) => {
  try {
    const response = await axiosInstance.get(`/tasks/${taskId}`);
    currentViewTask.value = response.data.data;
    isViewDialogOpen.value = true;
  } catch (error) {
    handleApiError(error);
  }
};

const handleCreateTask = async () => {
  try {
    const response = await axiosInstance.post('/tasks', newTask.value);
    toast.success(response?.data?.message || 'Task created successfully');
    resetForm();
    fetchTasks();
    isDialogOpen.value = false;
  } catch (error) {
    handleApiError(error);
  }
};

const handleUpdateTask = async () => {
  if (!currentTaskId.value) return;
  try {
    const response = await axiosInstance.put(`/tasks/${currentTaskId.value}`, newTask.value);
    toast.success(response?.data?.message || 'Task updated successfully');
    resetForm();
    fetchTasks();
    isDialogOpen.value = false;
  } catch (error) {
    handleApiError(error);
  }
};

const handleDeleteTask = async (_id: string) => {
  try {
    const response = await axiosInstance.delete(`/tasks/${_id}`);
    toast.success(response?.data?.message || 'Task deleted successfully');
    fetchTasks();
    isDialogOpen.value = false;
  } catch (error) {
    handleApiError(error);
  }
};

const handleEditTask = (task: Task) => {
  isEditing.value = true;
  currentTaskId.value = task._id;
  newTask.value = { ...task };
  isDialogOpen.value = true;
};

const handleViewTask = async (taskId: string) => {
  await fetchTaskDetails(taskId); // Memuat task untuk ditampilkan di view
};

const handleDateChange = (selectedDate: Date | undefined) => {
  newTask.value.deadline = selectedDate ? selectedDate.toISOString() : '';
};

const handleApiError = (error: unknown) => {
  toast.error('An error occurred');
  console.error(error);
};

const resetForm = () => {
  newTask.value = {
    name: '',
    description: '',
    completed: false,
    priority: 'Medium',
    category: '',
    deadline: '',
  };
  isEditing.value = false;
};
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold text-center mb-6">Manage Your Tasks</h1>
    <div class="text-center">
      <Button @click="isDialogOpen = true">Create Task</Button>
    </div>

    <Dialog v-model:open="isDialogOpen">
      <template #default>
        <h2>{{ isEditing ? 'Update Task' : 'Create New Task' }}</h2>
        <Input v-model="newTask.name" placeholder="Task Name" />
        <Textarea v-model="newTask.description" placeholder="Description" rows="4" />
        <Popover>
          <Button variant="outline">
            {{ newTask.deadline ? format(new Date(newTask.deadline), 'MMMM d, yyyy') : 'Pick a date' }}
            <CalendarIcon class="ml-2 h-4 w-4" />
          </Button>
          <template #content>
            <Calendar mode="single" :selected="newTask.deadline ? new Date(newTask.deadline) : null" @select="handleDateChange" />
          </template>
        </Popover>
        <Select v-model="newTask.priority">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </Select>
        <Input v-model="newTask.category" placeholder="Category" />
        <Select v-model="newTask.completed">
          <option :value="false">Incomplete</option>
          <option :value="true">Complete</option>
        </Select>
        <Button @click="isEditing ? handleUpdateTask : handleCreateTask">{{ isEditing ? 'Update Task' : 'Create Task' }}</Button>
      </template>
    </Dialog>

    <!-- Dialog untuk menampilkan task -->
    <Dialog v-model:open="isViewDialogOpen">
      <template #default>
        <h2>Task Details</h2>
        <Card v-if="currentViewTask">
          <p><strong>Name:</strong> {{ currentViewTask.name }}</p>
          <p><strong>Description:</strong> {{ currentViewTask.description }}</p>
          <p><strong>Priority:</strong> {{ currentViewTask.priority }}</p>
          <p><strong>Category:</strong> {{ currentViewTask.category }}</p>
          <p><strong>Deadline:</strong> {{ format(new Date(currentViewTask.deadline), 'MMMM d, yyyy') }}</p>
          <p><strong>Status:</strong> {{ currentViewTask.completed ? 'Complete' : 'Incomplete' }}</p>
        </Card>
      </template>
    </Dialog>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      <Card v-for="task in tasks" :key="task._id">
        <div class="flex justify-between items-center">
          <h3>{{ task.name }}</h3>
          <PencilIcon class="w-5 h-5 cursor-pointer" @click="handleEditTask(task)" />
        </div>
        <p>{{ task.description }}</p>
        <p>Priority: {{ task.priority }}</p>
        <p>Category: {{ task.category }}</p>
        <p>Deadline: {{ format(new Date(task.deadline), 'MMMM d, yyyy') }}</p>
        <p>Status: {{ task.completed ? 'Complete' : 'Incomplete' }}</p>
      </Card>
    </div>
  </div>
</template>

