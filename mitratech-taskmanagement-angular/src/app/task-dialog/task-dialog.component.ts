import { Component, Input } from '@angular/core';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
})
export class TaskDialogComponent {
  @Input() task: any = {};
  @Input() isEditMode = false;

  constructor(private taskService: TaskService) {}

  saveTask(): void {
    if (this.isEditMode) {
      this.taskService.updateTask(this.task._id, this.task).subscribe(() => {
        // Handle success
      });
    } else {
      this.taskService.createTask(this.task).subscribe(() => {
        // Handle success
      });
    }
  }
}
