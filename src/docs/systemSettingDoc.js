/**
 * @swagger
 * tags:
 *   - name: System Settings
 *     description: General and advanced system config for credit & savings
 */

/**
 * @swagger
 * /system-settings:
 *   get:
 *     tags: [System Settings]
 *     summary: Get current system settings
 *     responses:
 *       200:
 *         description: Successfully fetched
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /system-settings:
 *   put:
 *     tags: [System Settings]
 *     summary: Update or create system settings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SystemSetting'
 *     responses:
 *       200:
 *         description: Successfully updated
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SystemSetting:
 *       type: object
 *       properties:
 *         companyName:
 *           type: string
 *         brandColor:
 *           type: string
 *         logoUrl:
 *           type: string
 *         currency:
 *           type: string
 *         timezone:
 *           type: string
 *         interestRate:
 *           type: number
 *         creditLimit:
 *           type: number
 *         minSavingAmount:
 *           type: number
 *         allowOverdraft:
 *           type: boolean
 *         penaltyRate:
 *           type: number
 *         withdrawalLockDays:
 *           type: number
 *         autoApproveCredits:
 *           type: boolean
 */
