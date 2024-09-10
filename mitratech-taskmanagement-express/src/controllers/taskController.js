const Task = require('../models/taskModel');
const logger = require('../middlewares/logger');

// GET /tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        logger.info('Retrieved all tasks');
        res.status(200).json({
            statusCode: 200,
            message: 'Tasks retrieved successfully',
            data: tasks,
        });
    } catch (error) {
        logger.error(`Error retrieving tasks: ${error.message}`);
        res.status(500).json({
            statusCode: 500,
            message: error.message,
            data: null,
        });
    }
};

// POST /tasks
exports.createTask = async (req, res) => {
    const { name, description, completed, priority, category, deadline } =
        req.body;

    try {
        const existingTask = await Task.findOne({ name });
        if (existingTask) {
            logger.warn('Task with this name already exists');
            return res.status(400).json({
                statusCode: 400,
                message: 'Task with this name already exists',
                data: null,
            });
        }

        const task = new Task({
            name,
            description,
            completed,
            priority,
            category,
            deadline,
        });
        await task.save();
        logger.info(`Created new task: ${task.name}`);
        res.status(201).json({
            statusCode: 201,
            message: 'Task created successfully',
            data: task,
        });
    } catch (error) {
        logger.error(`Error creating task: ${error.message}`);
        res.status(400).json({
            statusCode: 400,
            message: error.message,
            data: null,
        });
    }
};

// GET /tasks/:id
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            logger.warn(`Task not found: ${req.params.id}`);
            return res.status(404).json({
                statusCode: 404,
                message: 'Task not found',
                data: null,
            });
        }
        logger.info(`Retrieved task: ${task.name}`);
        res.status(200).json({
            statusCode: 200,
            message: 'Task retrieved successfully',
            data: task,
        });
    } catch (error) {
        logger.error(`Error retrieving task: ${error.message}`);
        res.status(500).json({
            statusCode: 500,
            message: error.message,
            data: null,
        });
    }
};

// PUT /tasks/:id
exports.updateTaskById = async (req, res) => {
    const { name, description, completed, priority, category, deadline } =
        req.body;

    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            logger.warn(`Task not found: ${req.params.id}`);
            return res.status(404).json({
                statusCode: 404,
                message: 'Task not found',
                data: null,
            });
        }

        if (name && name !== task.name) {
            const existingTask = await Task.findOne({ name });
            if (existingTask) {
                logger.warn(`Task with this name already exists: ${name}`);
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Task with this name already exists',
                    data: null,
                });
            }
        }

        task.name = name || task.name;
        task.description = description || task.description;
        task.completed = completed !== undefined ? completed : task.completed;
        task.priority = priority || task.priority;
        task.category = category || task.category;
        task.deadline = deadline || task.deadline;

        await task.save();
        logger.info(`Updated task: ${task.name}`);
        res.status(200).json({
            statusCode: 200,
            message: 'Task updated successfully',
            data: task,
        });
    } catch (error) {
        logger.error(`Error updating task: ${error.message}`);
        res.status(400).json({
            statusCode: 400,
            message: error.message,
            data: null,
        });
    }
};

// DELETE /tasks/:id
exports.deleteTaskById = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            logger.warn(`Task not found: ${req.params.id}`);
            return res.status(404).json({
                statusCode: 404,
                message: 'Task not found',
                data: null,
            });
        }
        logger.info(`Deleted task: ${task.name}`);
        res.status(204).json({
            statusCode: 204,
            message: 'Task deleted successfully',
            data: null,
        });
    } catch (error) {
        logger.error(`Error deleting task: ${error.message}`);
        res.status(500).json({
            statusCode: 500,
            message: error.message,
            data: null,
        });
    }
};
