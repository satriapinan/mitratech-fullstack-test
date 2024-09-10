const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const taskController = require('../controllers/taskController');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            statusCode: 400,
            message: errors.array()[0].msg,
            data: [],
        });
    }
    next();
};

// GET /tasks
router.get('/tasks', taskController.getAllTasks);

// GET /tasks/:id
router.get(
    '/tasks/:id',
    [param('id').isMongoId().withMessage('Invalid task ID')],
    handleValidationErrors,
    taskController.getTaskById
);

// POST /tasks
router.post(
    '/tasks',
    [
        body('name')
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ max: 100 })
            .withMessage('Name must be less than 100 characters'),
        body('description')
            .optional()
            .isString()
            .withMessage('Description must be a string')
            .isLength({ max: 500 })
            .withMessage('Description must be less than 500 characters'),
        body('completed')
            .optional()
            .isBoolean()
            .withMessage('Completed must be a boolean'),
        body('priority')
            .optional()
            .isIn(['Low', 'Medium', 'High'])
            .withMessage('Priority must be one of Low, Medium, High'),
        body('category')
            .optional()
            .isString()
            .withMessage('Category must be a string')
            .isLength({ max: 50 })
            .withMessage('Category must be less than 50 characters'),
        body('deadline')
            .optional()
            .isISO8601()
            .withMessage('Deadline must be a valid date')
            .toDate(),
    ],
    handleValidationErrors,
    taskController.createTask
);

// PUT /tasks/:id
router.put(
    '/tasks/:id',
    [
        param('id').isMongoId().withMessage('Invalid task ID'),
        body('name')
            .optional()
            .notEmpty()
            .withMessage('Name cannot be empty if provided')
            .isLength({ max: 100 })
            .withMessage('Name must be less than 100 characters'),
        body('description')
            .optional()
            .isString()
            .withMessage('Description must be a string')
            .isLength({ max: 500 })
            .withMessage('Description must be less than 500 characters'),
        body('completed')
            .optional()
            .isBoolean()
            .withMessage('Completed must be a boolean'),
        body('priority')
            .optional()
            .isIn(['Low', 'Medium', 'High'])
            .withMessage('Priority must be one of Low, Medium, High'),
        body('category')
            .optional()
            .isString()
            .withMessage('Category must be a string')
            .isLength({ max: 50 })
            .withMessage('Category must be less than 50 characters'),
        body('deadline')
            .optional()
            .isISO8601()
            .withMessage('Deadline must be a valid date')
            .toDate(),
    ],
    handleValidationErrors,
    taskController.updateTaskById
);

// DELETE /tasks/:id
router.delete(
    '/tasks/:id',
    [param('id').isMongoId().withMessage('Invalid task ID')],
    handleValidationErrors,
    taskController.deleteTaskById
);

module.exports = router;
