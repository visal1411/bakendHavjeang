// ================= GET MECHANIC BY ID =================
export const getMechanicById = async (req, res) => {
  try {
    const { id } = req.params

    const mechanic = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        phone: true,
        usertype: true,
        mechanic_lat: true,
        mechanic_lng: true,
        working_hours: true
      }
    })

    if (!mechanic || mechanic.usertype.toLowerCase() !== "mechanic") {
      return res.status(404).json({ message: "Mechanic not found" })
    }

    res.status(200).json({
      message: "Mechanic fetched successfully",
      mechanic
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}
