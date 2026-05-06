export const validate = (schema) => (req, res, next) => {
  try {
    const data = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    req.validated = data;
    req.body = data.body ?? req.body;
    next();
  } catch (err) {
    if (err.issues && err.issues.length > 0) {
      return res.status(400).json({
        success: false,
        message: err.issues[0].message,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid request data",
    });
  }
};
