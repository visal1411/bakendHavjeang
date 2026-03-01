export const isCustomer = (req, res, next) => {
  if (req.user.usertype !== "customer") {
    return res.status(403).json({ message: "Customer only" })
  }
  next()
}

export const isMechanic = (req, res, next) => {
  if (req.user.usertype !== "mechanic") {
    return res.status(403).json({ message: "Mechanic only" })
  }
  next()
}
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.usertype)) {
      return res.status(403).json({
        message: `Access denied. Allowed roles: ${roles.join(", ")}`
      })
    }
    next()
  }
}
