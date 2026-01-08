import { prisma } from "../config/db.js"

export const requireFirstService = async (req, res, next) => {
  try {
    const user = req.user

    if (user.role === "mechanic") {
      const serviceCount = await prisma.service.count({
        where: { mechanicId: user.id }
      })

      if (serviceCount === 0) {
        // Allow only the route to create the first service
        if (req.path === "/" && req.method === "POST") {
          return next()
        }

        return res.status(403).json({
          message: "You must create at least one service before accessing this feature",
          firstTime: true
        })
      }
    }

    next()
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}
