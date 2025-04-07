import StudentPayment from "../models/studentPayment.model.js";
import User from "../models/user.model.js";
import Classroom from "../models/classroom.model.js";

export const processStudentPayment = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findById(studentId).populate("unpaidClasses");

    if (!student || student.role !== "Student") {
      return res.status(404).json({ message: "Student not found." });
    }

    const unpaid = student.unpaidClasses.filter(c => c.paymentStatus === "Unpaid");

    if (unpaid.length === 0) {
      return res.status(400).json({ message: "No unpaid classes found." });
    }

    const total = unpaid.reduce((sum, cls) => {
      const duration = cls.calssDurationInMinutes || 60;
      return sum + 8 * (duration / 60);
    }, 0);

    // Mark classes as Paid in Classroom
    for (const cls of unpaid) {
      await Classroom.updateOne(
        { "classes._id": cls._id },
        { $set: { "classes.$.paymentStatus": "Paid" } }
      );
    }

    // Create the payment record
    const payment = await StudentPayment.create({
      student: student._id,
      classIds: unpaid.map(c => c._id),
      totalAmount: total,
    });

    // Remove class IDs from unpaidClasses array
    student.unpaidClasses = student.unpaidClasses.filter(c => c.paymentStatus !== "Unpaid");
    await student.save();

    res.status(201).json({ message: "Payment recorded successfully.", payment });
  } catch (error) {
    console.error("Student payment error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
