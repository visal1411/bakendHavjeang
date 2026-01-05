export const isCustomer = (req, res, next) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Customer only" })
  }
  next()
}

export const isMechanic = (req, res, next) => {
  if (req.user.role !== "mechanic") {
    return res.status(403).json({ message: "Mechanic only" })
  }
  next()
}
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Allowed roles: ${roles.join(", ")}`
      })
    }
    next()
  }
}
