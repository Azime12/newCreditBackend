/**
 * @swagger
 * tags:
 *   - name: User Profiles
 *     description: User profile management including creation, update, and retrieval
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         street:
 *           type: string
 *           example: "Bole Road"
 *         city:
 *           type: string
 *           example: "Addis Ababa"
 *         state:
 *           type: string
 *           example: "Addis Ababa"
 *         country:
 *           type: string
 *           example: "Ethiopia"
 *         zipCode:
 *           type: string
 *           example: "1000"
 *         poBox:
 *           type: string
 *           example: "12345"
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         address:
 *           $ref: '#/components/schemas/Address'
 *         profileCompleted:
 *           type: boolean
 *         profilePhoto:
 *           type: string
 *           format: uri
 *           example: "https://example.com/profile.jpg"
 *         idType:
 *           type: string
 *           enum: [National ID, Passport, Kebele ID]
 *         idNumber:
 *           type: string
 *           example: "A1234567"
 *         idFrontPhoto:
 *           type: string
 *           format: uri
 *           example: "https://example.com/id_front.jpg"
 *         idBackPhoto:
 *           type: string
 *           format: uri
 *           example: "https://example.com/id_back.jpg"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProfileCompletionStatus:
 *       type: object
 *       properties:
 *         profileCompleted:
 *           type: boolean
 *           description: Indicates if all required profile fields are filled
 */

/**
 * @swagger
 * /users/profile/{userId}:
 *   post:
 *     summary: Create or update a user profile with file upload
 *     tags: [User Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 description: JSON string of address object
 *                 example: '{"street":"Bole Road","city":"Addis Ababa","state":"Addis Ababa","country":"Ethiopia","zipCode":"1000","poBox":"12345"}'
 *               idType:
 *                 type: string
 *                 enum: [National ID, Passport, Kebele ID]
 *               idNumber:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *               idFrontPhoto:
 *                 type: string
 *                 format: binary
 *               idBackPhoto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile created/updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /users/profile/{userId}:
 *   patch:
 *     summary: Partially update a user profile with file upload
 *     tags: [User Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 description: JSON string of address object (optional)
 *               idType:
 *                 type: string
 *                 enum: [National ID, Passport, Kebele ID]
 *               idNumber:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *               idFrontPhoto:
 *                 type: string
 *                 format: binary
 *               idBackPhoto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /users/profile/{userId}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [User Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /users/profile/isComplete/{userId}:
 *   get:
 *     summary: Check if user profile is complete
 *     tags: [User Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Profile completion status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileCompletionStatus'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 */
