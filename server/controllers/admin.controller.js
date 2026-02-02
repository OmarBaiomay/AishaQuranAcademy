import User from "../models/user.model.js";
import Blog from "../models/blog.model.js";
import Invoice from "../models/invoice.model.js";
import Payroll from "../models/payroll.model.js";
import models from "../models/classroom.model.js";
const { Classroom } = models;

export const getAdminStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const teachers = await User.countDocuments({ role: "Teacher" });
    const students = await User.countDocuments({ role: "Student" });
    const blogs = await Blog.countDocuments();
    const classes = await Classroom.countDocuments();

    // 🔢 Invoices Stats
    const totalInvoices = await Invoice.countDocuments();
    const paidInvoices = await Invoice.countDocuments({ status: "Paid" });
    const totalPayments = await Invoice.aggregate([
      { $match: { status: "Paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // 🧾 Payroll Stats
    const totalPayrolls = await Payroll.countDocuments();
    const paidPayrolls = await Payroll.countDocuments({ status: "Paid" });
    const totalPayrollAmount = await Payroll.aggregate([
      { $match: { status: "Paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({
      users,
      teachers,
      students,
      blogs,
      classes,

      // ✅ Invoices
      invoices: totalInvoices,
      paidInvoices,
      payments: totalPayments[0]?.total || 0,

      // ✅ Payrolls
      payrolls: totalPayrolls,
      paidPayrolls,
      payrollsAmount: totalPayrollAmount[0]?.total || 0
    });

  } catch (err) {
    console.error("❌ Admin stats error:", err);
    res.status(500).json({ message: "Error fetching stats" });
  }
};
