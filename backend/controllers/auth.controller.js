export const meRoute = (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

  res.status(200).json({
    success: true,
    data: { user: req.user },
    message: "User session exists",
  });
};