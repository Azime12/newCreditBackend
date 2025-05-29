/**
 * @swagger
 * tags:
 *   - name: Notifications
 *     description: Manage notifications and user preferences
 *   - name: Templates
 *     description: Manage notification templates
 */

/**
 * @swagger
 * /notify:
 *   post:
 *     summary: Send a notification to a user
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationRequest'
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /notifications/{userId}:
 *   get:
 *     summary: Get notifications for a user
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /templates:
 *   post:
 *     summary: Create a new notification template
 *     tags: [Templates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Template'
 *     responses:
 *       201:
 *         description: Template created successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /templates/{id}:
 *   get:
 *     summary: Get a notification template by ID
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Template retrieved successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /templates:
 *   get:
 *     summary: Get all notification templates
 *     tags: [Templates]
 *     responses:
 *       200:
 *         description: Templates retrieved successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /templates/{id}:
 *   put:
 *     summary: Update a notification template
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Template'
 *     responses:
 *       200:
 *         description: Template updated successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /templates/{id}:
 *   delete:
 *     summary: Delete a notification template
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Template deleted successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NotificationRequest:
 *       type: object
 *       required:
 *         - userId
 *         - type
 *         - data
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             amount:
 *               type: string
 *             due_date:
 *               type: string
 *     Template:
 *       type: object
 *       required:
 *         - type
 *         - template
 *       properties:
 *         type:
 *           type: string
 *         subtype:
 *           type: string
 *         template:
 *           type: string
 */
/**
 * @swagger
 * tags:
 *   - name: Notifications
 *     description: Manage notifications and user preferences
 *   - name: Templates
 *     description: Manage notification templates
 */

/**
 * @swagger
 * /notify:
 *   post:
 *     summary: Send a notification to a user
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationRequest'
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /notifications/{userId}:
 *   get:
 *     summary: Get notifications for a user
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /templates:
 *   post:
 *     summary: Create a new notification template
 *     tags: [Templates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Template'
 *     responses:
 *       201:
 *         description: Template created successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /templates/{id}:
 *   get:
 *     summary: Get a notification template by ID
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Template retrieved successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /templates:
 *   get:
 *     summary: Get all notification templates
 *     tags: [Templates]
 *     responses:
 *       200:
 *         description: Templates retrieved successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /templates/{id}:
 *   put:
 *     summary: Update a notification template
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Template'
 *     responses:
 *       200:
 *         description: Template updated successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /templates/{id}:
 *   delete:
 *     summary: Delete a notification template
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Template deleted successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NotificationRequest:
 *       type: object
 *       required:
 *         - userId
 *         - type
 *         - data
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             amount:
 *               type: string
 *             due_date:
 *               type: string
 *     Template:
 *       type: object
 *       required:
 *         - type
 *         - template
 *       properties:
 *         type:
 *           type: string
 *         subtype:
 *           type: string
 *         template:
 *           type: string
 */
/**
 * @swagger
 * tags:
 *   - name: User Preferences
 *     description: Manage user notification preferences
 */

/**
 * @swagger
 * /preferences:
 *   post:
 *     summary: Set or update user notification preferences
 *     tags: [User Preferences]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPreference'
 *     responses:
 *       200:
 *         description: Preference set or updated successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /preferences/{userId}:
 *   get:
 *     summary: Get user notification preferences
 *     tags: [User Preferences]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Preferences retrieved successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /preferences:
 *   put:
 *     summary: Update user notification preferences
 *     tags: [User Preferences]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPreference'
 *     responses:
 *       200:
 *         description: Preference updated successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /preferences:
 *   delete:
 *     summary: Delete user notification preferences
 *     tags: [User Preferences]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPreferenceDelete'
 *     responses:
 *       200:
 *         description: Preference deleted successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserPreference:
 *       type: object
 *       required:
 *         - userId
 *         - type
 *         - channel
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *         channel:
 *           type: string
 *         enabled:
 *           type: boolean
 *     UserPreferenceDelete:
 *       type: object
 *       required:
 *         - userId
 *         - type
 *         - channel
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *         channel:
 *           type: string
 */