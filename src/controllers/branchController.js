const {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
} = require("../services/branchService");

const {
  createBranchSchema,
  updateBranchSchema,
} = require("../validators/branchValidation");

// Helper function for error responses
const errorResponse = (res, status, error, details = null) => {
  return res.status(status).json({
    success: false,
    error,
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && { stack: details })
  });
};

exports.create = async (req, res) => {
  // Joi validation
  const { error } = createBranchSchema.validate(req.body);
  if (error) {
    return errorResponse(
      res, 
      400,
      'Validation Error',
      error.details.map(d => d.message)
    );
  }

  try {
    const branch = await createBranch(req.body);
    
    res.status(201).json({
      success: true,
      data: branch,
      message: 'Branch created successfully'
    });
    
  } catch (err) {
    // Handle known error types
    if (err.code && err.code.startsWith('DUPLICATE_')) {
      return errorResponse(
        res,
        400,
        err.message,
        { field: err.field }
      );
    }

    console.error('[Branch Controller] Create error:', err);
    errorResponse(
      res,
      500,
      'Failed to create branch',
      process.env.NODE_ENV === 'development' ? err.message : undefined
    );
  }
};

exports.getAll = async (_req, res) => {
  try {
    const branches = await getAllBranches();
    res.json({
      success: true,
      data: branches,
      count: branches.length
    });
  } catch (err) {
    console.error('[Branch Controller] Get all error:', err);
    errorResponse(res, 500, 'Failed to fetch branches');
  }
};

exports.getOne = async (req, res) => {
  try {
    const branch = await getBranchById(req.params.id);
    if (!branch) {
      return errorResponse(res, 404, 'Branch not found');
    }

    res.json({
      success: true,
      data: branch
    });
  } catch (err) {
    if (err.code === 'NOT_FOUND') {
      return errorResponse(res, 404, err.message);
    }

    console.error('[Branch Controller] Get one error:', err);
    errorResponse(res, 500, 'Failed to fetch branch');
  }
};


 exports.update = async (req, res) => {
  const { error } = updateBranchSchema.validate(req.body);
  if (error) {
    return errorResponse(
      res,
      400,
      'Validation Error',
      error.details.map((d) => d.message)
    );
  }

  try {
    const branch = await updateBranch(req.params.id, req.body);
    return res.json({
      success: true,
      message: 'Branch updated successfully',
      data: branch
    });
  } catch (err) {
    if (err.code === 'NOT_FOUND') {
      return errorResponse(res, 404, err.message);
    }

    if (err.code && err.code.startsWith('DUPLICATE_')) {
      return errorResponse(res, 400, err.message, { field: err.field });
    }

    console.error('[Branch Controller] Update error:', err);
    return errorResponse(res, 500, 'Failed to update branch');
  }
};



exports.remove = async (req, res) => {
  try {
    const result = await deleteBranch(req.params.id);
    
    res.json({
      success: true,
      message: 'Branch deleted successfully',
      data: result
    });
  } catch (err) {
    if (err.code === 'NOT_FOUND') {
      return errorResponse(res, 404, err.message);
    }

    console.error('[Branch Controller] Delete error:', err);
    errorResponse(res, 500, 'Failed to delete branch');
  }
};