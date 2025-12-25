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
