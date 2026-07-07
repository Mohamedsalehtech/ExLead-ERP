import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./App.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "./assets/logo.png";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";



import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaChevronDown,
  FaDownload,
  FaMoneyBillWave,
  FaMoneyCheckAlt,
  FaFileInvoiceDollar,
  FaHandHoldingUsd,
  FaCreditCard,
  FaChartBar,
  FaChartLine,
  FaFileExcel,
  FaFilePdf,
  FaPrint,
  FaHandshake,
  FaUserTie,
  FaWallet,
  FaDollarSign,
  FaProjectDiagram,
  FaCog,
  FaBullseye,
  FaWarehouse,
  FaBalanceScale,
  FaGift
} from "react-icons/fa";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  Tooltip,
  LabelList,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Legend,
  LineChart,
  Line,
  Cell
} from "recharts";
function App() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [revenueCategories, setRevenueCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [adjustments, setAdjustments] = useState([]);
  const [reportFrom, setReportFrom] = useState("");
const [reportTo, setReportTo] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activePage, setActivePage] = useState("dashboard");
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [monthlyTargets, setMonthlyTargets] = useState([]);
  const [selectedYear, setSelectedYear] =
useState("All");
  const [clients, setClients] = useState([]);
const [newDepartment, setNewDepartment] = useState({
  department_name: "",
});

const [editingDepartment, setEditingDepartment] = useState(null);
const [showAddAdjustment, setShowAddAdjustment] = useState(false);
const [editingAdjustment, setEditingAdjustment] = useState(null);
const [newAdjustment, setNewAdjustment] = useState({
  employee_id: "",
  adjustment_type: "",
  amount: "",
  reason: "",
  start_date: "",
  end_date: "",
  is_recurring: false,
});
const [showAddRevenue, setShowAddRevenue] = useState(false);

const [editingRevenue, setEditingRevenue] = useState(null);

const [newRevenue, setNewRevenue] = useState({
  project_name: "",
  revenue_date: "",
  amount: "",
  payment_method_id: "",
  Revenue_Category_id: "",
  department_id: "",
  employee_id: "",
  Description: "",
});
const [showAddExpense, setShowAddExpense] = useState(false);

const [editingExpense, setEditingExpense] = useState(null);

const [newExpense, setNewExpense] = useState({
  project_name: "",
  expense_date: "",
  amount: "",
  payment_method_id: "",
  expense_category_id: "",
  department_id: "",
  employee_id: "",
  description: ""
});
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    phone: "",
    email: "",
    position: "",
    department_id: "",
    basic_salary: "",
    hire_date: "",
    salary_effective_from: "",
  });
const [payrolls, setPayrolls] = useState([]);
const [companySettings, setCompanySettings] = useState(null);

const [showAddPayroll, setShowAddPayroll] = useState(false);

const [newPayroll, setNewPayroll] = useState({
  employee_id: "",
  payroll_month: "",
});
const [showTargetModal, setShowTargetModal] = useState(false);
const [editingTarget, setEditingTarget] = useState(null);
const [targetDepartment, setTargetDepartment] = useState("");
const [targetMonth, setTargetMonth] = useState("");
const [targetYear, setTargetYear] = useState(
  new Date().getFullYear()
);
const [showAddProject, setShowAddProject] = useState(false);

const [newProject, setNewProject] = useState({
  project_name: "",
  client_id: "",
  department_id: "",
  project_manager_id: "",
  project_value: "",
  start_date: "",
  expected_end_date: "",
  status: "Planned",
  notes: "",
});

const [projectPayments, setProjectPayments] = useState([]);

const [showAddProjectPayment, setShowAddProjectPayment] = useState(false);

const [newProjectPayment, setNewProjectPayment] = useState({
  project_id: "",
  payment_type: "Deposit",
  amount: "",
  due_date: "",
  payment_date: "",
  status: "Pending",
});

const [showAddClient, setShowAddClient] = useState(false);

const [newClient, setNewClient] = useState({
  client_name: "",
  company_name: "",
  phone: "",
  email: "",
  notes: "",
});
const [editingClient, setEditingClient] = useState(null);
const handleEditClient = (client) => {
  setEditingClient(client);
  setNewClient({
    client_name: client.client_name || "",
    company_name: client.company_name || "",
    phone: client.phone || "",
    email: client.email || "",
    notes: client.notes || "",
  });

  setShowAddClient(true);
};
const [editingProject, setEditingProject] = useState(null);
const [editingProjectPayment, setEditingProjectPayment] = useState(null);
const handleEditProjectPayment = (payment) => {
  setEditingProjectPayment(payment);

  setNewProjectPayment({
    project_id: payment.project_id,
    payment_type: payment.payment_type,
    amount: payment.amount,
    due_date: payment.due_date,
    status: payment.status,
  });

  setShowAddProjectPayment(true);
};
const [targetAmount, setTargetAmount] = useState("");

  useEffect(() => {
    loadData();
  
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
  
    return () => clearInterval(timer);
  
  }, []);

  const [selectedReport, setSelectedReport] = useState("Executive Summary"); 
  const [showExportMenu, setShowExportMenu] = useState(false);

async function loadData() {
  const { data: employeesData } = await supabase
  .from("employees")
  .select(`
    *,
    departments (
      department_name
    ),
    salary_history (
      salary_amount,
      effective_from
    )
  `);
const sortedEmployees = (employeesData || []).sort((a, b) => {
      if (a.name === "Mohamed Saleh") return -1;
      if (b.name === "Mohamed Saleh") return 1;
    
      return a.name.localeCompare(b.name);
    });

const { data: departmentsData } = await supabase
      .from("departments")
      .select("*");
      const { data: clientsData } = await supabase
.from("clients")
.select("*")
.order("client_name");



const { data: projectsData } = await supabase
  .from("projects")
  .select(`
    *,
    clients(client_name),
    departments(department_name),
    employees(name),
    Revenue_Category(*)
  `);

setProjects(projectsData || []);
const { data: revenuesData } = await supabase
      .from("revenues")
      .select("*")
      .order("revenue_date", { ascending: false });
      const { data: paymentMethodsData } =
await supabase
.from("payment_methods")
.select("*");

const { data: monthlyTargetsData } = await supabase
  .from("monthly_targets")
  .select("*");


const { data: companyData, error: companyError } = await supabase
  .from("company_settings")
  .select("*")
  .single();

setCompanySettings(companyData);

const { data: revenueCategoriesData } =
await supabase
.from("Revenue_Category")
.select("*");

    const { data: expensesData } = await supabase
      .from("expenses")
      .select("*")
      .order("expense_date", { ascending: false });
      const { data: expenseCategoriesData } =
      await supabase
        .from("Expense_Category")
        .select("*");
        const { data: adjustmentsData } = await supabase
  .from("adjustments")
  .select("*");

  
  const { data: payrollData } = await supabase
.from("payroll")
.select("*")
.order("payroll_month", { ascending: false });

const { data: projectPaymentsData } = await supabase
  .from("project_payments")
  .select(`
    *,
    projects(project_name)
  `);

setProjectPayments(projectPaymentsData || []);


setClients(clientsData || []);
      setEmployees(sortedEmployees);
    setDepartments(departmentsData || []);
    setProjects(projectsData || []);
    setRevenues(revenuesData || []);
    setPaymentMethods(paymentMethodsData || []);
setRevenueCategories(revenueCategoriesData || []);
setExpenseCategories(expenseCategoriesData || []);
    setExpenses(expensesData || []);
    setAdjustments(adjustmentsData || []);
    setMonthlyTargets(monthlyTargetsData || []);
    setClients(clientsData || []);
    setPayrolls(payrollData || []);

  }


  const departmentTargetAnalysis = departments.map((dep) => {
    console.log(
      "Department:",
      dep.department_name,
      "From:",
      reportFrom,
      "To:",
      reportTo
    );

    const target = monthlyTargets
  .filter((t) => {

    const targetMonth = Number(t.target_month);
    const targetYear = Number(t.target_year);

    const fromMonth = reportFrom
      ? new Date(reportFrom).getMonth() + 1
      : null;

    const fromYear = reportFrom
      ? new Date(reportFrom).getFullYear()
      : null;

    const toMonth = reportTo
      ? new Date(reportTo).getMonth() + 1
      : null;

    const toYear = reportTo
      ? new Date(reportTo).getFullYear()
      : null;

      return (
        t.department_id === dep.id &&
        (
          selectedYear === "All" ||
          targetYear === Number(selectedYear)
        ) &&
        (
          !reportFrom ||
          (
            targetYear > fromYear ||
            (
              targetYear === fromYear &&
              targetMonth >= fromMonth
            )
          )
        ) &&
        (
          !reportTo ||
          (
            targetYear < toYear ||
            (
              targetYear === toYear &&
              targetMonth <= toMonth
            )
          )
        )
      );

  })
  .reduce(
    (sum, t) => sum + Number(t.target_amount || 0),
    0
  );
  
    const actualRevenue = revenues
    .filter((r) => {
  
      const revenueDate = new Date(r.revenue_date);
  
      return (
        r.department_id === dep.id &&
        (selectedYear === "All" ||
          revenueDate.getFullYear() === Number(selectedYear)) &&
        (!reportFrom || revenueDate >= new Date(reportFrom)) &&
        (!reportTo || revenueDate <= new Date(reportTo))
      );
    })
    .reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0
    );
  
  
    const variance = actualRevenue - target;
  
    const achievement =
      target > 0
        ? (actualRevenue / target) * 100
        : 0;
  
    return {
      department: dep.department_name,
      target,
      actualRevenue,
      variance,
      achievement,
    };

  
  });const totalRevenue = revenues
  .filter((item) => {

    const d = new Date(item.revenue_date);

    return (
      selectedYear === "All" ||
      d.getFullYear() === Number(selectedYear)
    );

  })
  .reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

const totalExpenses = expenses
  .filter((item) => {

    const d = new Date(item.expense_date);

    return (
      selectedYear === "All" ||
      d.getFullYear() === Number(selectedYear)
    );

  })
  .reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

const totalPayroll = payrolls
  .filter((item) => {

    const d = new Date(
      item.payroll_month || item.created_at
    );

    return (
      selectedYear === "All" ||
      d.getFullYear() === Number(selectedYear)
    );

  })
  .reduce(
    (sum, item) =>
      sum + Number(item.net_salary || 0),
    0
  );

const netProfit =
  totalRevenue -
  totalExpenses;
  const DEPARTMENT_COLORS = {
    Training: "#84CC16",
    Marketing: "#FF00D4",
    Administration: "#D9D9D9",
    Programming: "#F59E0B",
    Freelancing: "#3B82F6",
    Licenses: "#EF4444",
  };
  const revenueChartData = departments.map((dep) => {

    const total = revenues
      .filter((rev) => {
  
        const d = new Date(rev.revenue_date);
  
        return (
          rev.department_id === dep.id &&
          (
            selectedYear === "All" ||
            d.getFullYear() === Number(selectedYear)
          )
        );
  
      })
      .reduce(
        (sum, rev) => sum + Number(rev.amount || 0),
        0
      );
  
    return {
      name: dep.department_name,
      amount: total,
    };
  
  }).filter(item => item.amount > 0);

  const totalRevenueValue = revenueChartData.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const [showReceivePayment, setShowReceivePayment] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState(null);
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedPaymentDate, setSelectedPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  
  const availableYears = [
    ...new Set([
      ...revenues.map(r => new Date(r.revenue_date).getFullYear()),
      ...expenses.map(e => new Date(e.expense_date).getFullYear())
    ])
  ].sort((a, b) => b - a);
  
  const monthlyRevenueData = Array.from({ length: 12 }, (_, month) => {

      const total = revenues
        .filter(r => {
    
          const d = new Date(r.revenue_date);
    
          return (
            (selectedYear === "All" ||
              d.getFullYear() === Number(selectedYear))
            &&
            d.getMonth() === month
          );
    
        })
        .reduce(
          (sum, r) => sum + Number(r.amount || 0),
          0
        );
    
      return {
        month: new Date(2025, month).toLocaleString(
          "en-US",
          { month: "short" }
        ),
        amount: total,
      };
    
    }); 
  
    const monthlyExpenseData = Array.from({ length: 12 }, (_, month) => {
      const total = expenses
        .filter(e => {
    
          const d = new Date(e.expense_date);
    
          return (
            (selectedYear === "All" ||
              d.getFullYear() === Number(selectedYear))
            &&
            d.getMonth() === month
          );
    
        })
        .reduce(
          (sum, e) => sum + Number(e.amount || 0),
          0
        );
    
      return {
        month: new Date(2025, month).toLocaleString(
          "en-US",
          { month: "short" }
        ),
        amount: total,
      };
    
    });
    
    
  
    const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
    const monthlyFinancialData = Array.from({ length: 12 }, (_, i) => {
      const month = monthNames[i];
    
      const revenue = revenues
  .filter((r) => {
    const date = new Date(r.revenue_date);

    return (
      date.getMonth() === i &&
      (selectedYear === "All" ||
        date.getFullYear() === Number(selectedYear))
    );
  })
  .reduce((sum, r) => sum + Number(r.amount || 0), 0);
    
  const expensesTotal = expenses
  .filter((e) => {
    const date = new Date(e.expense_date);

    return (
      date.getMonth() === i &&
      (selectedYear === "All" ||
        date.getFullYear() === Number(selectedYear))
    );
  })
  .reduce((sum, e) => sum + Number(e.amount || 0), 0);
    
  
    
  return {
    month,
    revenue,
    expenses: expensesTotal,
    profit: revenue - expensesTotal,
  };
    });

      const expenseChartData = departments.map((dep) => {

        const expenseTotal = expenses
          .filter((exp) => {
      
            const d = new Date(exp.expense_date);
      
            return (
              exp.department_id === dep.id &&
              (
                selectedYear === "All" ||
                d.getFullYear() === Number(selectedYear)
              )
            );
      
          })
          .reduce(
            (sum, exp) => sum + Number(exp.amount || 0),
            0
          );
      
        const payrollTotal = payrolls
          .filter((pay) => {
      
            const employee = employees.find(
              (emp) => emp.id === pay.employee_id
            );
      
            const payrollDate = new Date(
              pay.payroll_month || pay.created_at
            );
      
            return (
              employee?.department_id === dep.id &&
              (
                selectedYear === "All" ||
                payrollDate.getFullYear() === Number(selectedYear)
              )
            );
      
          })
          .reduce(
            (sum, pay) =>
              sum + Number(pay.net_salary || 0),
            0
          );
      
        return {
          name: dep.department_name,
          amount: expenseTotal + payrollTotal,
        };
      
      }).filter(item => item.amount > 0);
  


  const handleAddProject = async () => {
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          project_name: newProject.project_name,
          client_id: newProject.client_id,
          department_id: newProject.department_id,
          project_manager_id: newProject.project_manager_id,
          revenue_category_id: newProject.revenue_category_id,
          project_value: newProject.project_value,
          start_date: newProject.start_date,
          expected_end_date: newProject.expected_end_date,
          status: newProject.status,
          notes: newProject.notes,
  
          
        }
      ]);
  
    console.log("DATA:", data);
    console.log("ERROR:", error);
  
    if (error) {
      console.log(error);
      alert(error.message);
    }
   
  
    await loadData();
  
    setNewProject({
      project_name: "",
      client_id: "",
      department_id: "",
      project_manager_id: "",
      revenue_category_id: "",
      project_value: "",
      start_date: "",
      expected_end_date: "",
      status: "Planned",
      notes: "",
    });
  
    setShowAddProject(false);
  };

  const updateProject = async () => {
    const { error } = await supabase
      .from("projects")
      .update({
        project_name: newProject.project_name,
        client_id: newProject.client_id,
        department_id: newProject.department_id,
        project_manager_id: newProject.project_manager_id,
        project_value: newProject.project_value,
        start_date: newProject.start_date,
        expected_end_date: newProject.expected_end_date,
        status: newProject.status,
        notes: newProject.notes,
      })
      .eq("id", editingProject.id);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    await loadData();
  
    setEditingProject(null);
    setShowAddProject(false);
  };

const deleteProject = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this project?"
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  await loadData();
};

const handleAddProjectPayment = async () => {
  const { error } = await supabase
    .from("project_payments")
    .insert([
      {
        project_id: newProjectPayment.project_id,
        payment_type: newProjectPayment.payment_type,
        amount: newProjectPayment.amount,
        due_date: newProjectPayment.due_date,
        status: "Pending",
      },
    ]);

  if (error) {
    alert(error.message);
    return;
  }

  await loadData();

  setNewProjectPayment({
    project_id: "",
    payment_type: "Deposit",
    amount: "",
    due_date: "",
    payment_date: "",
    status: "Pending",
  });

  setShowAddProjectPayment(false);
};

const updateProjectPayment = async () => {
  const { error } = await supabase
    .from("project_payments")
    .update({
      project_id: newProjectPayment.project_id,
      payment_type: newProjectPayment.payment_type,
      amount: newProjectPayment.amount,
      due_date: newProjectPayment.due_date,
      status: newProjectPayment.status,
    })
    .eq("id", editingProjectPayment.id);

  if (error) {
    alert(error.message);
    return;
  }

  await loadData();

  setEditingProjectPayment(null);
  setShowAddProjectPayment(false);
};

const deleteProjectPayment = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this payment?"
  );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("project_payments")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  await loadData();
};

  const handleDeleteClient = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    );
  
    if (!confirmDelete) return;
  
    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", id);
  
    if (error) {
      console.error(error);
      alert("Error deleting client");
      return;
    }
  
    await loadData();
  };
  const handleAddClient = async () => {

    let error;
  
    if (editingClient) {
  
      const result = await supabase
        .from("clients")
        .update({
          client_name: newClient.client_name,
          company_name: newClient.company_name,
          phone: newClient.phone,
          email: newClient.email,
          notes: newClient.notes,
        })
        .eq("id", editingClient.id);
  
      error = result.error;
  
    } else {
  
      const result = await supabase
        .from("clients")
        .insert([
          {
            client_name: newClient.client_name,
            company_name: newClient.company_name,
            phone: newClient.phone,
            email: newClient.email,
            notes: newClient.notes,
          },
        ]);
  
      error = result.error;
    }
  
    if (error) {
      console.error(error);
      alert("Error Saving Client");
      return;
    }
    const departmentColors = {
      Training: "#84CC16",
      Marketing: "#FF00D4",
      Administration: "#D9D9D9",
      Programming: "#FFB300",
      Sales: "#3B82F6",
      HR: "#EF4444",
    };
  
    await loadData();
  
    setEditingClient(null);
  
    setNewClient({
      client_name: "",
      company_name: "",
      phone: "",
      email: "",
      notes: "",
    });
  
    setShowAddClient(false);
  };
  const totalExpenseValue = expenseChartData.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const TargetTooltip = ({
    active,
    payload,
    label,
  }) => {
    if (!active || !payload?.length) return null;
  
    const data = payload[0].payload;
  
    return (
      <div
        style={{
          background: "#F5F5F5",
          padding: "15px",
          borderRadius: "8px",
          border: "1px solid #DDD",
        }}
      >
        <div
          style={{
            color: data.color,
            fontSize: "22px",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          {label}
        </div>
  
        <div
          style={{
            color: "#8BE000",
            fontSize: "18px",
          }}
        >
          Actual Revenue :
          {Number(data.actualRevenue).toLocaleString()}
        </div>
  
        <div
          style={{
            color: "#FDB515",
            fontSize: "18px",
            marginTop: "5px",
          }}
        >
          Target :
          {Number(data.target).toLocaleString()}
        </div>
  
        <div
          style={{
            color: "#FF4D4F",
            fontSize: "18px",
            marginTop: "5px",
          }}
        >
          Achievement :
          {Number(data.achievement).toFixed(1)}%
        </div>
      </div>
    );
  };

  async function saveTarget() {

    let error;
  
    if (editingTarget) {
  
      const result = await supabase
        .from("monthly_targets")
        .update({
          department_id: targetDepartment,
          target_month: Number(targetMonth),
          target_year: Number(targetYear),
          target_amount: Number(targetAmount)
        })
        .eq("id", editingTarget.id);
  
      error = result.error;
  
    } else {
  
      const result = await supabase
        .from("monthly_targets")
        .insert([
          {
            department_id: targetDepartment,
            target_month: Number(targetMonth),
            target_year: Number(targetYear),
            target_amount: Number(targetAmount)
          }
        ]);
  
      error = result.error;
  
    }
  
    if (error) {
      alert(error.message);
      return;
    }
  
    setShowTargetModal(false);
  
    setEditingTarget(null);
  
    setTargetDepartment("");
    setTargetMonth("");
    setTargetYear(new Date().getFullYear());
    setTargetAmount("");
  
    loadData();
  }
  async function deleteTarget(id) {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this target?"
    );
  
    if (!confirmDelete) return;
  
    const { error } = await supabase
      .from("monthly_targets")
      .delete()
      .eq("id", id);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    loadData();
  }
  async function addEmployee() {

    const { error } = await supabase
      .from("employees")
      .insert([
        {
          name: newEmployee.name,
          phone: newEmployee.phone,
          email: newEmployee.email,
          position: newEmployee.position,
          department_id: newEmployee.department_id,
          basic_salary: Number(newEmployee.basic_salary),
          hire_date: newEmployee.hire_date,
        },
      ]);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    await loadData();
  
    setShowAddEmployee(false);
  
    setNewEmployee({
      name: "",
      phone: "",
      email: "",
      position: "",
      department_id: "",
      basic_salary: "",
      hire_date: "",
    });
  }

  async function updateEmployee() {
    const oldSalary = editingEmployee.basic_salary;
    const { error } = await supabase
      .from("employees")
      .update({
        name: newEmployee.name,
        phone: newEmployee.phone,
        email: newEmployee.email,
        position: newEmployee.position,
        department_id: newEmployee.department_id,
        basic_salary: Number(newEmployee.basic_salary),
        hire_date: newEmployee.hire_date,
      })
      .eq("id", editingEmployee.id);
  
    if (error) {
      alert(error.message);
      return;
    }
    if (Number(oldSalary) !== Number(newEmployee.basic_salary)) {
      await supabase
        .from("salary_history")
        .insert({
          employee_id: editingEmployee.id,
          salary_amount: Number(newEmployee.basic_salary),
          effective_from: newEmployee.salary_effective_from,
          notes: "Salary Updated",
        });
    }
  
    await loadData();
  
    setEditingEmployee(null);
    setShowAddEmployee(false);
  
    setNewEmployee({
      name: "",
      phone: "",
      email: "",
      position: "",
      department_id: "",
      basic_salary: "",
    });
  }
  async function addDepartment() {
    const { error } = await supabase
      .from("departments")
      .insert([
        {
          department_name: newDepartment.department_name,
        },
      ]);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    await loadData();
  
    setShowAddDepartment(false);
  
    setNewDepartment({
      department_name: "",
    });
  }
  async function addRevenue() {
    const { error } = await supabase
      .from("revenues")
      .insert([
        {
          project_name: newRevenue.project_name,
          revenue_date: newRevenue.revenue_date,
          amount: Number(newRevenue.amount),
          payment_method_id: Number(newRevenue.payment_method_id),
          Revenue_Category_id: Number(newRevenue.Revenue_Category_id),
          department_id: newRevenue.department_id || null,
          employee_id: newRevenue.employee_id || null,
          Description: newRevenue.Description,
        },
      ]);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    await loadData();
  
    setShowAddRevenue(false);
  
    setNewRevenue({
      project_name: "",
      revenue_date: "",
      amount: "",
      payment_method_id: "",
      Revenue_Category_id: "",
      department_id: "",
      employee_id: "",
      Description: "",
    });
  }
  async function addExpense() {
    const { error } = await supabase
      .from("expenses")
      .insert([
        {
          project_name: newExpense.project_name,
          expense_date: newExpense.expense_date,
          amount: Number(newExpense.amount),
          payment_method_id: Number(newExpense.payment_method_id),
          expense_category_id: Number(newExpense.expense_category_id),
          department_id: newExpense.department_id || null,
          employee_id: newExpense.employee_id || null,
          description: newExpense.description,
        },
      ]);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    await loadData();
    setEditingExpense(null);
    setShowAddExpense(false);
  
    setNewExpense({
      project_name: "",
      expense_date: "",
      amount: "",
      payment_method_id: "",
      expense_category_id: "",
      department_id: "",
      employee_id: "",
      description: "",
    });
  }
  async function updateExpense() {
    const { error } = await supabase
      .from("expenses")
      .update({
        project_name: newExpense.project_name,
        expense_date: newExpense.expense_date,
        amount: Number(newExpense.amount),
        payment_method_id: Number(newExpense.payment_method_id),
        expense_category_id: Number(newExpense.expense_category_id),
        department_id: newExpense.department_id || null,
        employee_id: newExpense.employee_id || null,
        description: newExpense.description,
      })
      .eq("id", editingExpense.id);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    await loadData();
  
    setEditingExpense(null);
    setShowAddExpense(false);
  
    setNewExpense({
      project_name: "",
      expense_date: "",
      amount: "",
      payment_method_id: "",
      expense_category_id: "",
      department_id: "",
      employee_id: "",
      description: "",
    });
  }
async function addAdjustment() {

  if (
    !newAdjustment.employee_id ||
    !newAdjustment.adjustment_type ||
    !newAdjustment.amount ||
    !newAdjustment.reason ||
    !newAdjustment.start_date
  ) {
    alert("Please fill all required fields");
    return;
  } 
  const finalEndDate =
  newAdjustment.is_recurring
    ? newAdjustment.end_date
    : newAdjustment.start_date;
  const { error } = await supabase
    .from("adjustments")
    .insert([
      {
        employee_id: newAdjustment.employee_id,
        adjustment_type: newAdjustment.adjustment_type,
        amount: Number(newAdjustment.amount),
        reason: newAdjustment.reason,
        start_date: newAdjustment.start_date,
end_date: finalEndDate,
        is_recurring: newAdjustment.is_recurring,
      },
    ]);

  if (error) {
    alert(error.message);
    return;
  }

  await loadData();

  setShowAddAdjustment(false);

  setNewAdjustment({
    employee_id: "",
    adjustment_type: "",
    amount: "",
    reason: "",
    start_date: "",
    end_date: "",
    is_recurring: false,
  });
}
async function updateAdjustment() {

if (
  !newAdjustment.is_recurring &&
  newAdjustment.start_date
) {
  newAdjustment.end_date = newAdjustment.start_date;
}
  const { error } = await supabase
    .from("adjustments")
    .update({
      employee_id: newAdjustment.employee_id,
      adjustment_type: newAdjustment.adjustment_type,
      amount: newAdjustment.amount,
      reason: newAdjustment.reason,
      start_date: newAdjustment.start_date,
      end_date: newAdjustment.end_date,
      is_recurring: newAdjustment.is_recurring,
    })
    .eq("id", editingAdjustment.id);

  if (error) {
    alert(error.message);
    return;
  }

  await loadData();

  setEditingAdjustment(null);

  setShowAddAdjustment(false);

  setNewAdjustment({
    employee_id: "",
    adjustment_type: "",
    amount: "",
    reason: "",
    start_date: "",
    end_date: "",
    is_recurring: false,
  });
}
async function deleteAdjustment(id) {

  const confirmDelete =
    window.confirm(
      "Are you sure you want to delete this adjustment?"
    );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("adjustments")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  await loadData();
}
  async function deleteExpense(id, projectName) {

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${projectName}" ?`
    );
  
    if (!confirmDelete) return;
  
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    await loadData();
  }
  async function updateDepartment() {
    const { error } = await supabase
      .from("departments")
      .update({
        department_name:
          newDepartment.department_name,
      })
      .eq("id", editingDepartment.id);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    await loadData();
  
    setEditingDepartment(null);
  
    setShowAddDepartment(false);
  
    setNewDepartment({
      department_name: "",
    });
  }
  const deleteRevenue = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this revenue?"
    );
  
    if (!confirmDelete) return;
  
    const { error } = await supabase
      .from("revenues")
      .delete()
      .eq("id", id);
  
    if (error) {
      alert(error.message);
    } else {
      loadData();
    }
  };
  
  async function updateRevenue() {

    const { error } = await supabase
      .from("revenues")
      .update({
        project_name: newRevenue.project_name,
        revenue_date: newRevenue.revenue_date,
        amount: Number(newRevenue.amount),
  
        payment_method_id: Number(
          newRevenue.payment_method_id
        ),
  
        Revenue_Category_id: Number(
          newRevenue.Revenue_Category_id
        ),
  
        department_id: newRevenue.department_id,
  
        employee_id: newRevenue.employee_id,
  
        Description: newRevenue.Description,
      })
      .eq("id", editingRevenue.id);
  
    if (error) {
      alert(error.message);
      return;
    }

    await loadData();
  
    setEditingRevenue(null);
  
    setShowAddRevenue(false);
    setMonthlyTargets(monthlyTargetsData || []);
  
    setNewRevenue({
      project_name: "",
      revenue_date: "",
      amount: "",
      payment_method_id: "",
      Revenue_Category_id: "",
      department_id: "",
      employee_id: "",
      Description: "",
    });
  }
  async function deleteDepartment(id, name) {

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${name}?`
    );
  
    if (!confirmDelete) return;
  
    const { error } = await supabase
      .from("departments")
      .delete()
      .eq("id", id);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    await loadData();
  }
  async function generatePayroll(employeeId, payrollMonth) {
    const employee = employees.find(emp => emp.id === employeeId);
  
    if (!employee) {
      alert("Employee not found");
      return;
    }
  
    const payrollMonthKey = payrollMonth;

    const activeAdjustments = adjustments.filter(adj => {

      const startMonth = adj.start_date.slice(0, 7);
    
      const endMonth = adj.end_date
        ? adj.end_date.slice(0, 7)
        : null;
    
      return (
        adj.employee_id === employeeId &&
        startMonth <= payrollMonth &&
        (!endMonth || endMonth >= payrollMonth)
      );
    
    });
    console.log("ACTIVE:", activeAdjustments);
  
    const totalBonus = activeAdjustments
      .filter(adj => adj.adjustment_type === "Bonus")
      .reduce((sum, adj) => sum + Number(adj.amount || 0), 0);
  
    const totalDeduction = activeAdjustments
      .filter(adj => adj.adjustment_type === "Deduction")
      .reduce((sum, adj) => sum + Number(adj.amount || 0), 0);
  
    const basicSalary = Number(employee.basic_salary || 0);
  
    const netSalary =
      basicSalary +
      totalBonus -
      totalDeduction;
      const { data: existingPayroll } = await supabase
      .from("payroll")
      .select("id")
      .eq("employee_id", employeeId)
      .eq("payroll_month", payrollMonth + "-01");
      if (existingPayroll.length > 0) {
        alert("Payroll already exists for this employee and month");
        return;
      }
      const { data, error } = await supabase
      .from("payroll")
      .insert([
        {
          employee_id: employeeId,
          payroll_month: payrollMonth + "-01",
          basic_salary: basicSalary,
          total_bonus: totalBonus,
          total_deduction: totalDeduction,
          net_salary: netSalary,
        },
      ])
      .select();
    
    console.log("PAYROLL DATA:", data);
    console.log("PAYROLL ERROR:", error);
    console.log("Employee ID:", employeeId);

    if (error) {
      alert(error.message);
      return;
    }
    await supabase
  .from("expenses")
  .insert([
    {
      expense_category_id: 2, // Payroll
      payment_method_id: 2,   // Bank Transfer
      amount: netSalary,
      expense_date: payrollMonth + "-01",
      project_name: "Monthly Salaries",
    },
  ]);
    await supabase
  .from("expenses")
  .insert([
    {
      amount: netSalary,
      description: `Salary - ${employee.name}`,
      expense_date: payrollMonth + "-01",
      employee_id: employeeId,
      department_id: employee.department_id,
      expense_category_id: 2,
    },
  ]);
    loadData();
  
    await loadData();
    setShowAddPayroll(false);

setNewPayroll({
  employee_id: "",
  payroll_month: "",
});

  }
  async function deletePayroll(id) {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payroll?"
    );
  
    if (!confirmDelete) return;
  
    const { error } = await supabase
      .from("payroll")
      .delete()
      .eq("id", id);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    await loadData();
  
    alert("Payroll deleted successfully");
  } 
  async function deleteEmployee(id, name) {

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${name}?`
    );
  
    if (!confirmDelete) return;
  
    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    loadData();
  }
function exportPayrollPDF(payroll) {
  const doc = new jsPDF();
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = companySettings.logo_url;
  
  img.onload = () => {
  
    const logoWidth = 35;
    const logoHeight = (img.height * logoWidth) / img.width;
    doc.addImage(
      img,
      "PNG",
      20,
      10,
      logoWidth,
      logoHeight
    );
  
    doc.setFontSize(20);
  
    doc.setFontSize(10);
    doc.text(`Phone: ${companySettings?.phone || ""}`, 65, 18);
    doc.text(`Email: ${companySettings?.email || ""}`, 65, 24);
    doc.text(`Website: ${companySettings?.website || ""}`, 65, 30);
    doc.text(`Address: ${companySettings?.address || ""}`, 65, 36);
    doc.setDrawColor(142, 214, 0);
doc.setLineWidth(0.5);
doc.line(15, 45, 195, 45);
doc.setFontSize(22);
doc.setFont(undefined, "bold");
doc.text("PAYROLL SLIP", 20, 60);
doc.setFontSize(11);

doc.text(
  `Payroll Month: ${payroll.payroll_month?.slice(0,7)}`,
  135,
  55
);

doc.text(
  `Issue Date: ${new Date().toISOString().split("T")[0]}`,
  135,
  62
);
  
    autoTable(doc, {
      startY: 75,
      headStyles: {
        fillColor: [142, 214, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      body: [
        [
          "Employee Name",
          employees.find(
            (emp) => emp.id === payroll.employee_id
          )?.name || ""
        ],
        ["Payroll Month", payroll.payroll_month?.slice(0,7)],
        ["Basic Salary", payroll.basic_salary],
        ["Bonus", payroll.total_bonus],
        ["Deduction", payroll.total_deduction],
        ["Net Salary", payroll.net_salary],
      ],
      columnStyles: {
        0: {
          fontStyle: "bold"
        }
      },
    });
  
    doc.save(
      `Payroll-${payroll.payroll_month}.pdf`
    );
  
  };
 
}
const filteredRevenues = revenues.filter(
  (item) =>
    (!reportFrom || item.revenue_date >= reportFrom) &&
    (!reportTo || item.revenue_date <= reportTo)
);

const reportTotalRevenue = filteredRevenues.reduce(
  (sum, item) => sum + Number(item.amount || 0),
  0
);


const filteredEmployees = employees.filter(
  emp => emp.department_id == newProject.department_id
);

const filteredExpenses = expenses.filter(
  (item) =>
    (!reportFrom || item.expense_date >= reportFrom) &&
    (!reportTo || item.expense_date <= reportTo)
);

const reportTotalExpenses = filteredExpenses.reduce(
  (sum, item) => sum + Number(item.amount || 0),
  0
);
const filteredPayrolls = payrolls.filter(
  (item) =>
    (!reportFrom || item.payroll_month >= reportFrom) &&
    (!reportTo || item.payroll_month <= reportTo)
);
function exportToExcel() {

  let data = [];
  let fileName = "Report";

  switch (selectedReport) {
    case "Revenue Report":
      fileName = "Revenue Report";

      data = filteredRevenues.map((item) => ({
        Date: item.revenue_date,
        Project: item.project_name,
        Category:
          revenueCategories.find(
            (c) => Number(c.id) === Number(item.Revenue_Category_id)
          )?.revenue_categories || "",

        PaymentMethod:
          paymentMethods.find(
            (p) => Number(p.id) === Number(item.payment_method_id)
          )?.method_name || "",

        Department:
          departments.find(
            (d) => Number(d.id) === Number(item.department_id)
          )?.department_name || "",

        Employee:
          employees.find(
            (e) => Number(e.id) === Number(item.employee_id)
          )?.name || "",

        Amount: item.amount,
      }));

      break;

    default:
      alert("Excel Export is not available for this report yet.");
      return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Report"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(file, `${fileName}.xlsx`);
}

const markPaymentAsPaid = async (
  payment,
  paymentMethodId,
  paymentDate
) => {
  try {

    const { error: paymentError } = await supabase
      .from("project_payments")
      .update({
        status: "Paid",
        payment_date: paymentDate,
        payment_method_id: Number(paymentMethodId),
      })
      .eq("id", payment.id);

    if (paymentError) throw paymentError;

    const project = projects.find(
      p => Number(p.id) === Number(payment.project_id)
    );

    if (project) {
      const { error: revenueError } = await supabase
        .from("revenues")
        .insert([
          {
            amount: payment.amount,
            revenue_date: paymentDate,
            project_name: project.project_name,
            department_id: project.department_id,
            employee_id: project.project_manager_id,
            Revenue_Category_id: project.revenue_category_id,
            payment_method_id: Number(paymentMethodId),
            Description: `Project Payment - ${project.project_name}`,
          },
        ]);

      if (revenueError) throw revenueError;
    }

    await loadData();

    setShowReceivePayment(false);
    setSelectedPayment(null);
    setSelectedPaymentMethod("");
    setSelectedPaymentDate(
      new Date().toISOString().split("T")[0]
    );
    
    alert("Payment marked as paid");
    
    return;

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

const reportPayrollExpenses = filteredPayrolls.reduce(
  (sum, item) => sum + Number(item.net_salary || 0),
  0
);
const reportNetProfit =
  reportTotalRevenue -
  reportTotalExpenses;
  const profitMargin =
  reportTotalRevenue > 0
    ? (reportNetProfit / reportTotalRevenue) * 100
    : 0;

const averageProjectRevenue =
  projects.length > 0
    ? reportTotalRevenue / projects.length
    : 0;

const revenuePerEmployee =
  employees.length > 0
    ? reportTotalRevenue / employees.length
    : 0;

const expenseRatio =
  reportTotalRevenue > 0
    ? (reportTotalExpenses / reportTotalRevenue) * 100
    : 0;

const payrollRatio =
  reportTotalRevenue > 0
    ? (reportPayrollExpenses / reportTotalRevenue) * 100
    : 0;  

  const departmentAnalysis = departments.map((dept) => {

    const deptRevenue = revenues
    .filter((r) => {
  
      const revenueDate = new Date(r.revenue_date);
  
      return (
        r.department_id === dept.id &&
        (
          selectedYear === "All" ||
          revenueDate.getFullYear() === Number(selectedYear)
        ) &&
        (!reportFrom || revenueDate >= new Date(reportFrom)) &&
        (!reportTo || revenueDate <= new Date(reportTo))
      );
  
    })
    .reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0
    );
    
  
    const deptExpenses = expenses
    .filter((e) => {
  
      const expenseDate = new Date(e.expense_date);
  
      return (
        e.department_id === dept.id &&
        e.project_name !== "Monthly Salaries" &&
        (!reportFrom || expenseDate >= new Date(reportFrom)) &&
        (!reportTo || expenseDate <= new Date(reportTo))
      );
  
    })
    .reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );
    
  
    const deptPayroll = payrolls
    .filter((p) => {
  
      const emp = employees.find(
        (e) => e.id === p.employee_id
      );
  
      const payrollDate = new Date(
        p.payroll_month || p.created_at
      );
  
      return (
        emp?.department_id === dept.id &&
        (!reportFrom || payrollDate >= new Date(reportFrom)) &&
        (!reportTo || payrollDate <= new Date(reportTo))
      );
  
    })
    .reduce(
      (sum, p) => sum + Number(p.net_salary || 0),
      0
    );
    return {
      department: dept.department_name,
      revenue: deptRevenue,
      expenses: deptExpenses,
      payroll: deptPayroll,
      totalCost: deptExpenses + deptPayroll,
      profit: deptRevenue - deptExpenses - deptPayroll,
      profitMargin:
  deptRevenue > 0
    ? ((deptRevenue - deptExpenses - deptPayroll) / deptRevenue) * 100
    : (
        deptExpenses + deptPayroll > 0
          ? -100
          : 0
      )
    };
  });
  const totalProfitContribution =
  departmentAnalysis
    .filter(dep => dep.profit > 0)
    .reduce(
      (sum, dep) => sum + dep.profit,
      0
    );
    console.log(
      "Total Department Profit:",
      departmentAnalysis.reduce(
        (sum, d) => sum + d.profit,
        0
      )
    );
    
    console.log(
      "Dashboard Profit:",
      reportNetProfit
    );

    const departmentProfitChartData =
    departmentAnalysis
      .filter(dep => dep.profit > 0)
      .map(dep => ({
        department: dep.department,
        revenue: dep.revenue,
        cost: dep.totalCost,
        profit: dep.profit,
        contribution:
          totalProfitContribution > 0
            ? Number(
                (((dep.profit / totalProfitContribution) * 100).toFixed(1))
              )
            : 0,
  
        color:
          dep.department === "Training"
            ? "#8BE000"
            : dep.department === "Marketing"
            ? "#FF00D4"
            : dep.department === "Administration"
            ? "#CFCFCF"
            : "#FFB000",
      }));
      const cashCollectionData = (() => {
        const filteredProjects = projects.filter((project) => {
          if (!project.start_date) return true;
        
          const projectDate = new Date(project.start_date);
        
          return (
            (selectedYear === "All" ||
              projectDate.getFullYear() === Number(selectedYear)) &&
            (!reportFrom || projectDate >= new Date(reportFrom)) &&
            (!reportTo || projectDate <= new Date(reportTo))
          );
        });
      
        const totalDue = projectPayments
  .filter((payment) => {
    const dueDate = new Date(payment.due_date);

    return (
      (selectedYear === "All" ||
        dueDate.getFullYear() === Number(selectedYear)) &&
      (!reportFrom || dueDate >= new Date(reportFrom)) &&
      (!reportTo || dueDate <= new Date(reportTo))
    );
  })
  .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

         
      
        const totalCollected = projectPayments
        .filter((payment) => {
          if (payment.status !== "Paid") return false;
      
          const paymentDate = new Date(payment.payment_date);
      
          return (
            (selectedYear === "All" ||
              paymentDate.getFullYear() === Number(selectedYear)) &&
            (!reportFrom || paymentDate >= new Date(reportFrom)) &&
            (!reportTo || paymentDate <= new Date(reportTo))
          ); 
        })
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
      
        const totalRemaining = totalDue - totalCollected;

        const collectionRate =
          totalDue === 0
            ? 0
            : (totalCollected / totalDue) * 100;
        
        return {
          totalDue,
          totalCollected,
          totalRemaining,
          collectionRate,
        };
      })();
      
      const projectFilteredRevenues = revenues.filter((revenue) => {
        const revenueDate = new Date(revenue.revenue_date);
      
        return (
          (selectedYear === "All" ||
            revenueDate.getFullYear() === Number(selectedYear)) &&
          (!reportFrom || revenueDate >= new Date(reportFrom)) &&
          (!reportTo || revenueDate <= new Date(reportTo))
        );
      });
      
      const topProjectsRevenue = (() => {
        const projectRevenue = projectFilteredRevenues.reduce((acc, revenue) => {
          const projectName = revenue.project_name || "Unknown";
      
          if (!acc[projectName]) {
            acc[projectName] = 0;
          }
      
          acc[projectName] += Number(revenue.amount || 0);
      
          return acc;
        }, {});
      
        const data = Object.entries(projectRevenue)
          .map(([project_name, revenue]) => ({
            project_name,
            revenue,
          }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);
      
        return data;
      })();
      
      const departmentTargetChartData =
      departmentTargetAnalysis
        .filter(dep => dep.target > 0 || dep.actualRevenue > 0)
        .map(dep => ({
          department: dep.department,
          target: dep.target,
          actualRevenue: dep.actualRevenue,
          achievement: dep.achievement,
    
          color:
            dep.department === "Training"
              ? "#8BE000"
              : dep.department === "Marketing"
              ? "#FF00E5"
              : dep.department === "Administration"
              ? "#D9D9D9"
              : "#FDB515",
        }));
        const bestDepartment =
  departmentAnalysis.length > 0
    ? [...departmentAnalysis].sort((a, b) => b.profit - a.profit)[0]
    : null;

const worstDepartment =
  departmentAnalysis.length > 0
    ? [...departmentAnalysis].sort((a, b) => a.profit - b.profit)[0]
    : null;

const bestProject =
  topProjectsRevenue.length > 0
    ? topProjectsRevenue[0]
    : null;

const highestRevenueEmployee = (() => {
  const employeeRevenue = {};

  revenues.forEach((r) => {
    if (!r.employee_id) return;

    employeeRevenue[r.employee_id] =
      (employeeRevenue[r.employee_id] || 0) +
      Number(r.amount || 0);
  });

  const winner = Object.entries(employeeRevenue).sort(
    (a, b) => b[1] - a[1]
  )[0];

  if (!winner) return null;

  const emp = employees.find(
    (e) => String(e.id) === String(winner[0])
  );

  return {
    name: emp?.name || "-",
    revenue: winner[1],
  };
})();
const formatNumber = (value) => {
  if (!value) return "0";

  if (value >= 1000000)
    return `${(value / 1000000).toFixed(1).replace(".0", "")}M`;

  if (value >= 1000)
    return `${(value / 1000).toFixed(0)}K`;

  return value.toLocaleString();
};

const highestRevenueCategory = (() => {
  const data = {};

  revenues.forEach((r) => {
    const cat = revenueCategories.find(
      (c) => Number(c.id) === Number(r.Revenue_Category_id)
    );

    const categoryName = cat?.revenue_categories || "Unknown";

    data[categoryName] =
      (data[categoryName] || 0) + Number(r.amount || 0);
  });

  return Object.entries(data).sort((a, b) => b[1] - a[1])[0];
})();

const highestExpenseCategory = (() => {
  const data = {};

  expenses.forEach((e) => {
    if (e.project_name === "Monthly Salaries") return;

    const cat = expenseCategories.find(
      (c) => Number(c.id) === Number(e.expense_category_id)
    );

    const categoryName = cat?.expense_categories || "Unknown";

    data[categoryName] =
      (data[categoryName] || 0) + Number(e.amount || 0);
  });

  return Object.entries(data).sort((a, b) => b[1] - a[1])[0];
})();
  return (
    <div className="app">
      <aside className="sidebar">
      <img
  src={logo}
  alt="ExLead"
  className="sidebar-logo"
/>

        <ul className="menu">
        <div className="sidebar-section-title">
  MAIN
</div>     

        <li
  className={activePage === "dashboard" ? "active" : ""}
  onClick={() => setActivePage("dashboard")}
>
  <FaHome />
  <span>Dashboard</span>
</li>

<div className="sidebar-section-title">
  OPERATIONS
</div>

<li
  className={activePage === "clients" ? "active" : ""}
  onClick={() => setActivePage("clients")}
>
<FaHandshake />
<span>Clients</span>
</li>

<li
  className={activePage === "projects" ? "active" : ""}
  onClick={() => setActivePage("projects")}
>
  <FaProjectDiagram />
  <span>Projects</span>
</li>

<li
  className={activePage === "projectPayments" ? "active" : ""}
  onClick={() => setActivePage("projectPayments")}
>
<FaHandHoldingUsd />
  <span>P.Payments</span>
</li>
<div className="sidebar-section-title">
  FINANCIAL MANAGEMENT
</div>
<li
  className={activePage === "revenues" ? "active" : ""}
  onClick={() => setActivePage("revenues")}
>
<FaChartLine />
  <span>Revenues</span>
</li>

<li
  className={activePage === "expenses" ? "active" : ""}
  onClick={() => setActivePage("expenses")}
>
<FaWallet />
  <span>Expenses</span>
</li>
<li
  className={activePage === "adjustments" ? "active" : ""}
  onClick={() => setActivePage("adjustments")}
>
  <FaGift />
  <span>Adjustments</span>
</li>


<li
  className={activePage === "monthlyTargets" ? "active" : ""}
  onClick={() => setActivePage("monthlyTargets")}
>
<FaBullseye />
  <span>monthly TGT</span>
</li>
<div className="sidebar-section-title">
  HUMAN RESOURCES
</div>
<li
  className={activePage === "employees" ? "active" : ""}
  onClick={() => setActivePage("employees")}
>
  <FaUsers />
  <span>Employees</span>
</li>

<li
  className={activePage === "departments" ? "active" : ""}
  onClick={() => setActivePage("departments")}
>
  <FaBuilding />
  <span>Departments</span>
</li>
<li
  className={activePage === "payroll" ? "active" : ""}
  onClick={() => setActivePage("payroll")}
>
  <FaMoneyCheckAlt />
  <span>Payroll</span>
</li>
<div className="sidebar-section-title">
  ACCOUNTING
</div>
<li
  className={activePage === "reports" ? "active" : ""}
  onClick={() => setActivePage("reports")}
>
  <FaChartBar />
  <span>Reports</span>
</li>
<li
  className={activePage === "assets" ? "active" : ""}
  onClick={() => setActivePage("assets")}
>
  <FaWarehouse />
  <span>Assets</span>
</li>

<li
  className={activePage === "liabilities" ? "active" : ""}
  onClick={() => setActivePage("liabilities")}
>
  <FaFileInvoiceDollar />
  <span>Liabilities</span>
</li>

<li
  className={activePage === "equity" ? "active" : ""}
  onClick={() => setActivePage("equity")}
>
  <FaBalanceScale />
  <span>Equity</span>
</li>
<div className="sidebar-section-title">
  SYSTEM
</div>
<li
  className={activePage === "Settings" ? "active" : ""}
  onClick={() => setActivePage("Settings")}
>
<FaCog />
  <span>Settings</span>
</li>


</ul>
      </aside>

      <main className="main">

      {activePage === "employees" && (
<>
<div className="employees-page">

<div className="header employees-header">
  <h1>Employees Management</h1>

    <button
      className="add-btn"
      onClick={() => {
        setEditingEmployee(null);
      
        setNewEmployee({
          name: "",
          phone: "",
          email: "",
          position: "",
          department_id: "",
          hire_date: "",
          basic_salary: "",
          salary_effective_from: "",
        });
      
        setShowAddEmployee(true);
      }}
    >
      + Add Employee
    </button>

  </div>

  <table className="employees-table">

    <thead>
    <tr>
  <th>Name</th>
  <th>Department</th>
  <th>Position</th>
  <th>Actions</th>
</tr>
    </thead>

    <tbody>

      {employees.map((emp) => (
        <tr key={emp.id}>
<td>{emp.name}</td>

<td>
  {emp.departments?.department_name || "-"}
</td>

<td>{emp.position}</td>

<td>
<button
  onClick={() => {
    setEditingEmployee(emp);

    const lastSalary =
    emp.salary_history?.sort(
      (a, b) =>
        new Date(b.effective_from) - new Date(a.effective_from)
    )[0];
  
  setNewEmployee({
    name: emp.name || "",
    phone: emp.phone || "",
    email: emp.email || "",
    position: emp.position || "",
    department_id: emp.department_id || "",
    basic_salary: lastSalary?.salary_amount || emp.basic_salary || "",
    hire_date: emp.hire_date || "",
    salary_effective_from:
      lastSalary?.effective_from || "",
  });  
    setShowAddEmployee(true);
  }}
>
  Edit
</button>
            <button
  onClick={() => deleteEmployee(emp.id, emp.name)}
>
  Delete
</button>
          </td>
        </tr>
      ))}

    </tbody>

  </table>

</div>
{showAddEmployee && (
  <div className="modal-overlay">
    <div className="modal">

    <h2>
  {editingEmployee ? "Edit Employee" : "Add Employee"}
</h2>

      <input
        placeholder="Name"
        value={newEmployee.name}
        onChange={(e) =>
          setNewEmployee({
            ...newEmployee,
            name: e.target.value,
          })
        }
      />

      <input
        placeholder="Phone"
        value={newEmployee.phone}
        onChange={(e) =>
          setNewEmployee({
            ...newEmployee,
            phone: e.target.value,
          })
        }
      />

      <input
        placeholder="Email"
        value={newEmployee.email}
        onChange={(e) =>
          setNewEmployee({
            ...newEmployee,
            email: e.target.value,
          })
        }
      />

      <input
        placeholder="Position"
        value={newEmployee.position}
        onChange={(e) =>
          setNewEmployee({
            ...newEmployee,
            position: e.target.value,
          })
        }
      />
      <select
  value={newEmployee.department_id}
  onChange={(e) =>
    setNewEmployee({
      ...newEmployee,
      department_id: e.target.value,
    })
  }
>
  <option value="">Select Department</option>

  {departments.map((dept) => (
    <option
      key={dept.id}
      value={dept.id}
    >
      {dept.department_name}
    </option>
  ))}
</select>
<input
  type="date"
  value={newEmployee.hire_date}
  onChange={(e) =>
    setNewEmployee({
      ...newEmployee,
      hire_date: e.target.value,
    })
  }
/>
{editingEmployee && (
  <>
    <label>Salary Effective From *</label>

    <input
      type="date"
      value={newEmployee.salary_effective_from || ""}
      onChange={(e) =>
        setNewEmployee({
          ...newEmployee,
          salary_effective_from: e.target.value,
        })
      }
    />
  </>
)}
      <input
        placeholder="Basic Salary"
        value={newEmployee.basic_salary}
        onChange={(e) =>
          setNewEmployee({
            ...newEmployee,
            basic_salary: e.target.value,
          })
        }
      />

      <div className="modal-actions">

      <button
  className="save-btn"
  onClick={() => {

    if (editingEmployee) {

      if (!newEmployee.salary_effective_from) {
        alert("Please select the Salary Effective From date.");
        return;
      }

      updateEmployee();

    } else {

      addEmployee();

    }
  }}
>
  Save
</button>

        <button
        className="cancel-btn"
          onClick={() => setShowAddEmployee(false)}
        >
          Cancel
        </button>

      </div>

    </div>
  </div>
)}

</>
)}

{activePage === "projectPayments" && (
  <div className="employees-page">

    <div className="header employees-header">
      <h1>Project Payments Management</h1>

      <button
        className="add-btn"
        onClick={() => setShowAddProjectPayment(true)}
      >
        + Add Payment
      </button>
    </div>

    <div className="card">
      <table className="employees-table">

        <thead>
          <tr>
            <th>Project</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
            <th>Payment</th>
          </tr>
        </thead>

        <tbody>

          {projectPayments.map((payment) => (
            <tr key={payment.id}>

<td>{payment.projects?.project_name}</td>

              <td>{payment.payment_type}</td>

              <td>{payment.amount}</td>

              <td>{payment.due_date}</td>

              <td>{payment.status}</td>

              <td>
  <div className="actions-cell">
  <button
  className="edit-btn"
  onClick={() => {
    if (payment.status === "Paid") {
      alert("Paid payments cannot be edited");
      return;
    }

    handleEditProjectPayment(payment);
  }}
>
  Edit
</button> 

<button
  className="delete-btn"
  onClick={() => {
    if (payment.status === "Paid") {
      alert("Paid payments cannot be deleted");
      return;
    }

    deleteProjectPayment(payment.id);
  }}
>
  Delete
</button> 
  </div>
</td>

              <td>
  {payment.status !== "Paid" && (
    <button
    className="add-btn"
    onClick={() => {
      setSelectedPayment(payment);
      setSelectedPaymentMethod("");
    
      setSelectedPaymentDate(
        new Date().toISOString().split("T")[0]
      );
    
      setShowReceivePayment(true);
    }}
  >
    Mark As Paid
  </button>
  )}
</td>

            </tr>
          ))}

        </tbody>

      </table>
      {showAddProjectPayment && (
  <div className="modal-overlay">
    <div className="modal">

      <div className="modal-header">
        <h2>Add Project Payment</h2>
      </div>

      <div className="modal-body">

        <select
          value={newProjectPayment.project_id}
          onChange={(e) =>
            setNewProjectPayment({
              ...newProjectPayment,
              project_id: e.target.value,
            })
          }
        >
          <option value="">
            Select Project
          </option>

          {projects.map((project) => (
            <option
              key={project.id}
              value={project.id}
            >
              {project.project_name}
            </option>
          ))}
        </select>

        <select
          value={newProjectPayment.payment_type}
          onChange={(e) =>
            setNewProjectPayment({
              ...newProjectPayment,
              payment_type: e.target.value,
            })
          }
        >
          <option value="Deposit">Deposit</option>
          <option value="Installment">Installment</option>
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={newProjectPayment.amount}
          onChange={(e) =>
            setNewProjectPayment({
              ...newProjectPayment,
              amount: e.target.value,
            })
          }
        />

        <input
          type="date"
          value={newProjectPayment.due_date}
          onChange={(e) =>
            setNewProjectPayment({
              ...newProjectPayment,
              due_date: e.target.value,
            })
          }
        />

      </div>

      <div className="modal-footer">

        <button
          className="cancel-btn"
          onClick={() =>
            setShowAddProjectPayment(false)
          }
        >
          Cancel
        </button>

        <button
  className="add-btn"
  onClick={
    editingProjectPayment
      ? updateProjectPayment
      : handleAddProjectPayment
  }
>
  {editingProjectPayment ? "Update Payment" : "Save Payment"}
</button>

      </div>

    </div>
  </div>
)}
    </div>
    
    {showReceivePayment && (
  <div className="modal-overlay">
    <div className="modal">

      <div className="modal-header">
        <h2>Receive Payment</h2>
      </div>

      <div className="modal-body">

        <p>
          Amount:
          <strong>
            {" "}
            {Number(selectedPayment?.amount || 0).toLocaleString()}
          </strong>
        </p>

        <select
          value={selectedPaymentMethod}
          onChange={(e) =>
            setSelectedPaymentMethod(e.target.value)
          }
        >
          <option value="">
            Select Payment Method
          </option>

          {paymentMethods.map((method) => (
            <option
              key={method.id}
              value={method.id}
            >
              {method.method_name}
            </option>
          ))}
        </select>
        <input
  type="date"
  value={selectedPaymentDate}
  onChange={(e) =>
    setSelectedPaymentDate(e.target.value)
  }
/>

      </div>

      <div className="modal-footer">

        <button
          className="cancel-btn"
          onClick={() => {
            setShowReceivePayment(false);
setSelectedPayment(null);
setSelectedPaymentMethod("");
setSelectedPaymentDate(
  new Date().toISOString().split("T")[0]
);
          }}
        >
          Cancel
        </button>

        <button
          className="add-btn"
          onClick={() =>
            markPaymentAsPaid(
              selectedPayment,
              selectedPaymentMethod,
              selectedPaymentDate
            )
          }
        >
          Confirm Payment
        </button>

      </div>

    </div>
  </div>
)}
  </div>
)}


{activePage === "projects" && (
  <div className="employees-page">

    <div className="header employees-header">
      <h1>Projects Management</h1>

      <button
  className="add-btn"
  onClick={() => setShowAddProject(true)}
  
>
  + Add Project
</button>

    </div>

    <div className="card">
    <table className="employees-table">
  <thead>
    <tr>
      <th>Project</th>
      <th>Client</th>
      <th>Value</th>
      <th>Paid</th>
      <th>Remaining</th>
      <th>Status</th>
      <th>Department</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {projects.map((project) => (
      <tr key={project.id}>
       <td>{project.project_name}</td>

<td>{project.clients?.client_name}</td>

<td>{project.project_value}</td>

<td>
  {
    projectPayments
      .filter(
        p =>
          Number(p.project_id) === Number(project.id) &&
          p.status === "Paid"
      )
      .reduce(
        (sum, p) =>
          sum + Number(p.amount || 0),
        0
      )
  }
</td>

<td>
  {
    Number(project.project_value || 0) -
    projectPayments
      .filter(
        p =>
          Number(p.project_id) === Number(project.id) &&
          p.status === "Paid"
      )
      .reduce(
        (sum, p) =>
          sum + Number(p.amount || 0),
        0
      )
  }
</td>

<td>{project.status}</td>

<td>{project.departments?.department_name}</td>

<td> 
  <button
    className="edit-btn"
    onClick={() => {
      setEditingProject(project);
      setNewProject(project);
      setShowAddProject(true);
    }}
  >
    Edit
  </button>

  <button
    className="delete-btn"
    onClick={() => deleteProject(project.id)}
  >
    Delete
  </button>
</td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
    {showAddProject && (
  <div className="modal-overlay">
    <div className="modal">

      <div className="modal-header">
      <h2>
  {editingProject ? "Edit Project" : "Add Project"}
</h2>
      </div>

      <div className="modal-body">

        <input
          type="text"
          placeholder="Project Name"
          value={newProject.project_name}
          onChange={(e) =>
            setNewProject({
              ...newProject,
              project_name: e.target.value,
            })
          }
        />

        <select
          value={newProject.client_id}
          onChange={(e) =>
            setNewProject({
              ...newProject,
              client_id: e.target.value,
            })
          }
        >
          <option value="">
            Select Client
          </option>

          {clients.map((client) => (
            <option
              key={client.id}
              value={client.id}
            >
              {client.client_name}
            </option>
          ))}
        </select>

        <select
          value={newProject.department_id}
          onChange={(e) =>
            setNewProject({
              ...newProject,
              department_id: e.target.value,
              project_manager_id: "",
            })
          }
        >
          <option value="">
            Select Department
          </option>

          {departments.map((dep) => (
            <option
              key={dep.id}
              value={dep.id}
            >
              {dep.department_name}
            </option>
          ))}
        </select>
        <input
  type="number"
  placeholder="Project Value"
  value={newProject.project_value || ""}
  onChange={(e) =>
    setNewProject({
      ...newProject,
      project_value: e.target.value,
    })
  }
/>
<input
  type="date"
  value={newProject.start_date || ""}
  onChange={(e) =>
    setNewProject({
      ...newProject,
      start_date: e.target.value,
    })
  }
/>
<input
  type="date"
  value={newProject.expected_end_date || ""}
  onChange={(e) =>
    setNewProject({
      ...newProject,
      expected_end_date: e.target.value,
    })
  }
/>
<select
  value={newProject.project_manager_id || ""}
  onChange={(e) =>
    setNewProject({
      ...newProject,
      project_manager_id: e.target.value,
    })
  }
>
  <option value="">Select Project Manager</option>

  {filteredEmployees.map((emp) => (
  <option key={emp.id} value={emp.id}>
    {emp.name}
  </option>
))}
</select>

<select
  value={newProject.revenue_category_id || ""}
  onChange={(e) =>
    setNewProject({
      ...newProject,
      revenue_category_id: e.target.value,
    })
  }
>
  <option value="">
    Select Project Category
  </option>

  {revenueCategories.map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.revenue_categories}
    </option>
  ))}
</select>

<select
  value={newProject.status || "Planned"}
  onChange={(e) =>
    setNewProject({
      ...newProject,
      status: e.target.value,
    })
  }
>
  <option value="Planned">Planned</option>
  <option value="In Progress">In Progress</option>
  <option value="Completed">Completed</option>
  <option value="Cancelled">Cancelled</option>
</select>
<textarea
  placeholder="Notes"
  value={newProject.notes || ""}
  onChange={(e) =>
    setNewProject({
      ...newProject,
      notes: e.target.value,
    })
  }
/>

      </div>

      <div className="modal-footer">

        <button
          className="cancel-btn"
          onClick={() => {
            setEditingProject(null);
            setShowAddProject(false);
          }}
        >
          Cancel
        </button>

        <button
  className="add-btn"
  onClick={() => {
    if (editingProject) {
      updateProject();
    } else {
      handleAddProject();
    }
  }}
>
  {editingProject ? "Update Project" : "Save Project"}
</button>

      </div>

    </div>
  </div>
)}

  </div>
  
  
)}

{showAddClient && (
  <div className="modal-overlay">
    <div className="modal">

      <div className="modal-header">
      <h2>
  {editingClient ? "Edit Client" : "Add Client"}
</h2>
      </div>

      <div className="modal-body">

        <input
          type="text"
          placeholder="Client Name"
          value={newClient.client_name}
          onChange={(e) =>
            setNewClient({
              ...newClient,
              client_name: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Company Name"
          value={newClient.company_name}
          onChange={(e) =>
            setNewClient({
              ...newClient,
              company_name: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Phone"
          value={newClient.phone}
          onChange={(e) =>
            setNewClient({
              ...newClient,
              phone: e.target.value,
            })
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={newClient.email}
          onChange={(e) =>
            setNewClient({
              ...newClient,
              email: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Notes"
          value={newClient.notes}
          onChange={(e) =>
            setNewClient({
              ...newClient,
              notes: e.target.value,
            })
          }
        />

      </div>

      <div className="modal-footer">

        <button
          className="cancel-btn"
          onClick={() => setShowAddClient(false)}
        >
          Cancel
        </button>

        <button
          className="add-btn"
          onClick={handleAddClient}
        >
          Save Client
        </button>

      </div>

    </div>
  </div>
)}

{activePage === "departments" && (
  <>
    <div className="header employees-header">

      <h1>Departments Management</h1>

      <button
        className="add-btn"
        onClick={() => setShowAddDepartment(true)}
      >
        + Add Department
      </button>

    </div>

    <div className="employees-table">

      <table>

        <thead>
          <tr>
            <th>Department Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {departments.map((dept) => (
            <tr key={dept.id}>

              <td>{dept.department_name}</td>

              <td>
              <button
  onClick={() => {
    setEditingDepartment(dept);

    setNewDepartment({
      department_name: dept.department_name,
    });

    setShowAddDepartment(true);
  }}
>
  Edit
</button>

<button
  onClick={() =>
    deleteDepartment(
      dept.id,
      dept.department_name
    )
  }
>
  Delete
</button>
              </td>

            </tr>
          ))}

        </tbody>

        </table>

</div>

{showAddDepartment && (
  <div className="modal-overlay">
    <div className="modal">

    <h2>
  {editingDepartment
    ? "Edit Department"
    : "Add Department"}
</h2>

      <input
        placeholder="Department Name"
        value={newDepartment.department_name}
        onChange={(e) =>
          setNewDepartment({
            department_name: e.target.value,
          })
        }
      />

      <div className="modal-actions">

     <button
  className="save-btn"
  onClick={() => {
    if (editingDepartment) {
      updateDepartment();
    } else {
      addDepartment();
    }
  }}
>
  Save
</button>

        <button
        className="cancel-btn"
onClick={() => {
  setEditingDepartment(null);
  setShowAddDepartment(false);
}}
        >
          Cancel
        </button>

      </div>

    </div>
  </div>
)}

</>
)}
{activePage === "clients" && (
  <div className="employees-page">

    <div className="header employees-header">
      <h1>Clients Management</h1>

      <button
  className="add-btn"
  onClick={() => setShowAddClient(true)}
>
  + Add Client
</button>

    </div>

    <div className="card">
      <table className="employees-table">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Company</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((client) => (
           <tr key={client.id}>
           <td>{client.client_name}</td>
           <td>{client.company_name}</td>
           <td>{client.phone}</td>
           <td>{client.email}</td>
         
           <td>
           <button
  className="edit-btn"
  onClick={() => {
    setEditingClient(client);
  
    setNewClient({
      client_name: client.client_name || "",
      company_name: client.company_name || "",
      phone: client.phone || "",
      email: client.email || "",
      notes: client.notes || "",
    });
  
    setShowAddClient(true);
  }}
>
  Edit
</button>
         
<button
  className="delete-btn"
  onClick={() => handleDeleteClient(client.id)}
>
  Delete
</button>
           </td>
         </tr> 
          ))}
        </tbody>
      </table>
    </div>

  </div>
)}
{activePage === "revenues" && (
<>
  <div className="header employees-header">

    <h1>Revenue Management</h1>

    <button
  className="add-btn"
  onClick={() => setShowAddRevenue(true)}
>
  + Add Revenue
</button>

  </div>

  <div className="employees-table">

    <table>

    <thead>
  <tr>
    <th>Project</th>
    <th>Date</th>
    <th>Amount</th>
    <th>Actions</th>
  </tr>
</thead>

      <tbody>

        {revenues.map((rev) => (
          <tr key={rev.id}>
  <td>{rev.project_name}</td>
  <td>{rev.revenue_date}</td>
  <td>{rev.amount}</td>

  <td>

    <button
      onClick={() => {
        setEditingRevenue(rev);
        setNewRevenue(rev);
        setShowAddRevenue(true);
      }}
    >
      Edit
    </button>

    <button
      onClick={() => deleteRevenue(rev.id)}
    >
      Delete
    </button>

  </td>
</tr>
        ))}

      </tbody>

    </table>

  </div>
{showAddRevenue && (
  <div className="modal-overlay">
    <div className="modal">

    <h2>
  {editingRevenue
    ? "Edit Revenue"
    : "Add Revenue"}
</h2>

      <input
        placeholder="Project Name"
        value={newRevenue.project_name}
        onChange={(e) =>
          setNewRevenue({
            ...newRevenue,
            project_name: e.target.value,
          })
        }
      />

      <input
        type="date"
        value={newRevenue.revenue_date}
        onChange={(e) =>
          setNewRevenue({
            ...newRevenue,
            revenue_date: e.target.value,
          })
        }
      />

      <input
        placeholder="Amount"
        value={newRevenue.amount}
        onChange={(e) =>
          setNewRevenue({
            ...newRevenue,
            amount: e.target.value,
          })
        }
      />
      <select
  value={newRevenue.payment_method}
  onChange={(e) =>
    setNewRevenue({
      ...newRevenue,
      payment_method_id: e.target.value,
    })
  }
>
  <option value="">
    Select Payment Method
  </option>

  {paymentMethods.map((item) => (
    <option
      key={item.id}
      value={item.id}
    >
      {item.method_name}
    </option>
  ))}
</select>
<select
value={newRevenue.Revenue_Category_id}
  onChange={(e) =>
    setNewRevenue({
      ...newRevenue,
      Revenue_Category_id: e.target.value,
    })
  }
>
  <option value="">
    Select Revenue Category
  </option>

  {revenueCategories.map((item) => (
    <option
      key={item.id}
      value={item.id}
    >
      {item.revenue_categories}
    </option>
  ))}
</select>


<select
  value={newRevenue.department_id}
  onChange={(e) =>
    setNewRevenue({
      ...newRevenue,
      department_id: e.target.value,
      employee_id: "",
    })
  }
>
  <option value="">Select Department</option>

  {departments.map((item) => (
    <option key={item.id} value={item.id}>
      {item.department_name}
    </option>
  ))}
</select>

<select
  value={newRevenue.employee_id}
  onChange={(e) =>
    setNewRevenue({
      ...newRevenue,
      employee_id: e.target.value,
    })
  }
>
  <option value="">Select Employee</option>

  {employees
    .filter(
      (item) =>
        item.department_id === newRevenue.department_id
    )
    .map((item) => (
      <option key={item.id} value={item.id}>
        {item.name}
      </option>
    ))}
</select>


<textarea
  placeholder="Description"
  value={newRevenue.Description}
  onChange={(e) =>
    setNewRevenue({
      ...newRevenue,
      Description: e.target.value,
    })
  }
/>

      <div className="modal-actions">

        <button
          className="save-btn"
          onClick={() => {
            if (editingRevenue) {
              updateRevenue();
            } else {
              addRevenue();
            }
          }}
        >
          Save
        </button>

        <button
        className="cancel-btn"
          onClick={() => setShowAddRevenue(false)}
        >
          Cancel
        </button>

      </div>

    </div>
  </div>
)}


</>
)}
{activePage === "expenses" && (
<>
  <div className="header employees-header">

    <h1>Expense Management</h1>

    <button
      className="add-btn"
      onClick={() => setShowAddExpense(true)}
    >
      + Add Expense
    </button>

  </div>

  <div className="employees-table">

    <table>

      <thead>
        <tr>
          <th>Project</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>

        {expenses.map((exp) => (
          <tr key={exp.id}>

            <td>{exp.project_name}</td>
            <td>{exp.expense_date}</td>
            <td>{exp.amount}</td>

            <td>
            <button
  onClick={() => {
    setEditingExpense(exp);

    setNewExpense({
      project_name: exp.project_name,
      expense_date: exp.expense_date,
      amount: exp.amount,
      payment_method_id: exp.payment_method_id,
      expense_category_id: exp.expense_category_id,
      department_id: exp.department_id,
      employee_id: exp.employee_id,
      description: exp.description,
    });

    setShowAddExpense(true);
  }}
>
  Edit
</button>
<button
  onClick={() =>
    deleteExpense(exp.id, exp.project_name)
  }
>
  Delete
</button>
            </td>

          </tr>
        ))}

      </tbody>

    </table>

  </div>
  {showAddExpense && (
  <div className="modal-overlay">
    <div className="modal">

      <h2>Add Expense</h2>

      <input
        placeholder="Project Name"
        value={newExpense.project_name}
        onChange={(e) =>
          setNewExpense({
            ...newExpense,
            project_name: e.target.value,
          })
        }
      />

      <input
        type="date"
        value={newExpense.expense_date}
        onChange={(e) =>
          setNewExpense({
            ...newExpense,
            expense_date: e.target.value,
          })
        }
      />

      <input
        placeholder="Amount"
        value={newExpense.amount}
        onChange={(e) =>
          setNewExpense({
            ...newExpense,
            amount: e.target.value,
          })
        }
      />
      <select
  value={newExpense.department_id}
  onChange={(e) =>
    setNewExpense({
      ...newExpense,
      department_id: e.target.value,
      employee_id: "",
    })
  }
>
  <option value="">Select Department</option>

  {departments.map((item) => (
    <option key={item.id} value={item.id}>
      {item.department_name}
    </option>
  ))}
</select>
<select
  value={newExpense.employee_id}
  onChange={(e) =>
    setNewExpense({
      ...newExpense,
      employee_id: e.target.value,
    })
  }
>
  <option value="">Select Employee</option>

  {employees
  .filter(
    (item) =>
      item.department_id === newExpense.department_id
  )
  .map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))}
</select>
      <select
        value={newExpense.payment_method_id}
        onChange={(e) =>
          setNewExpense({
            ...newExpense,
            payment_method_id: e.target.value,
          })
        }
      >
        <option value="">Select Payment Method</option>

        {paymentMethods.map((item) => (
          <option key={item.id} value={item.id}>
            {item.method_name}
          </option>
        ))}
      </select>

      <select
        value={newExpense.expense_category_id}
        onChange={(e) =>
          setNewExpense({
            ...newExpense,
            expense_category_id: e.target.value,
          })
        }
      >
        <option value="">Select Expense Category</option>

        {expenseCategories.map((item) => (
          <option key={item.id} value={item.id}>
            {item.expense_categories}
          </option>
        ))}
      </select>

      <div className="modal-actions">

        <button
          className="save-btn"
          onClick={() => {
            if (editingExpense) {
              updateExpense();
            } else {
              addExpense();
            }
          }}
        >
          Save
        </button>

        <button
        className="cancel-btn"
          onClick={() => setShowAddExpense(false)}
        >
          Cancel
        </button>

      </div>

    </div>
  </div>
)}

</>
)}
{showAddAdjustment && (
<div className="modal-overlay">
  <div className="modal">

    <h2>
      {editingAdjustment ? "Edit Adjustment" : "Add Adjustment"}
    </h2>

    <select
      value={newAdjustment.employee_id}
      onChange={(e) =>
        setNewAdjustment({
          ...newAdjustment,
          employee_id: e.target.value,
        })
      }
    >
      <option value="">Select Employee</option>

      {employees.map((emp) => (
        <option key={emp.id} value={emp.id}>
          {emp.name}
        </option>
      ))}
    </select>

    <select
      value={newAdjustment.adjustment_type}
      onChange={(e) =>
        setNewAdjustment({
          ...newAdjustment,
          adjustment_type: e.target.value,
        })
      }
    >
      <option value="">Select Type</option>
      <option value="Bonus">Bonus</option>
      <option value="Deduction">Deduction</option>
    </select>

    <input
      type="number"
      placeholder="Amount"
      value={newAdjustment.amount}
      onChange={(e) =>
        setNewAdjustment({
          ...newAdjustment,
          amount: e.target.value,
        })
      }
    />

    <input
      type="text"
      placeholder="Reason"
      value={newAdjustment.reason}
      onChange={(e) =>
        setNewAdjustment({
          ...newAdjustment,
          reason: e.target.value,
        })
      }
    />

<label>Start Date</label>

<input
  type="date"
  value={newAdjustment.start_date}
  onChange={(e) =>
    setNewAdjustment({
      ...newAdjustment,
      start_date: e.target.value,
    })
  }
/>
{newAdjustment.is_recurring && (
  <>
    <label>End Date</label>

    <input
      type="date"
      value={newAdjustment.end_date}
      onChange={(e) =>
        setNewAdjustment({
          ...newAdjustment,
          end_date: e.target.value,
        })
      }
    />
  </>
)}

<div className="checkbox-row">

  <input
    type="checkbox"
    checked={newAdjustment.is_recurring}
    onChange={(e) =>
      setNewAdjustment({
        ...newAdjustment,
        is_recurring: e.target.checked,
      })
    }
  />

  <span>Recurring</span>

</div>

<div className="modal-actions">

<button
  className="save-btn"
  onClick={() => {
    if (editingAdjustment) {
      updateAdjustment();
    } else {
      addAdjustment();
    }
  }}
>
  Save
</button>

<button
  className="cancel-btn"
  onClick={() => {
    setEditingAdjustment(null);

    setShowAddAdjustment(false);

    setNewAdjustment({
      employee_id: "",
      adjustment_type: "",
      amount: "",
      reason: "",
      start_date: "",
      end_date: "",
      is_recurring: false,
    });
  }}
>
  Cancel
</button>
</div>

  </div>
</div>
)}
{activePage === "adjustments" && (
<>
  <div className="header employees-header">

    <h1>Adjustments Management</h1>

    <button
      className="add-btn"
      onClick={() => setShowAddAdjustment(true)}
    >
      + Add Adjustment
    </button>

  </div>

  <div className="employees-table">

    <table>

      <thead>
        <tr>
          <th>Employee</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Reason</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>

        {adjustments.map((adj) => (
          <tr key={adj.id}>

<td>
  {
    employees.find(
      (emp) => emp.id === adj.employee_id
    )?.name
  }
</td>

            <td>{adj.adjustment_type}</td>

            <td>{adj.amount}</td>

            <td>{adj.reason}</td>
<td>

  <button
    onClick={() => {
      setEditingAdjustment(adj);

      setNewAdjustment({
        employee_id: adj.employee_id,
        adjustment_type: adj.adjustment_type,
        amount: adj.amount,
        reason: adj.reason,
        start_date: adj.start_date,
        end_date: adj.end_date,
        is_recurring: adj.is_recurring,
      });

      setShowAddAdjustment(true);
    }}
  >
    Edit
  </button>

  <button
    onClick={() => deleteAdjustment(adj.id)}
  >
    Delete
  </button>

</td>            

          </tr>
        ))}

      </tbody>

    </table>

  </div>
</>
)}
{activePage === "monthlyTargets" && (
<>
  <div className="header employees-header">

    <h1>Monthly Targets Management</h1>

    <button
  className="add-btn"
  onClick={() => setShowTargetModal(true)}
>
  + Add Target
</button>

  </div>

  <div className="employees-table">

  <table>
  <thead>
    <tr>
      <th>Department</th>
      <th>Month</th>
      <th>Year</th>
      <th>Target Amount</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {monthlyTargets.map((target) => (
      <tr key={target.id}>
        <td>
          {
            departments.find(
              d => d.id === target.department_id
            )?.department_name
          }
        </td>

        <td>{target.target_month}</td>
        <td>{target.target_year}</td>
        <td>{target.target_amount.toLocaleString()}</td>

        <td>
        <button
  className="edit-btn"
  onClick={() => {
    setEditingTarget(target);

    setTargetDepartment(target.department_id);
    setTargetMonth(target.target_month);
    setTargetYear(target.target_year);
    setTargetAmount(target.target_amount);

    setShowTargetModal(true);
  }}
>
  Edit
</button>

<button
  className="delete-btn"
  onClick={() => deleteTarget(target.id)}
>
  Delete
</button>
</td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
</>
)}
{showTargetModal && (
  <div className="modal-overlay">
    <div className="modal">

    <h2>
  {editingTarget
    ? "Edit Monthly Target"
    : "Add Monthly Target"}
</h2>

      <select
        value={targetDepartment}
        onChange={(e) =>
          setTargetDepartment(e.target.value)
        }
      >
        <option value="">Select Department</option>

        {departments.map((dep) => (
          <option
            key={dep.id}
            value={dep.id}
          >
            {dep.department_name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Month"
        value={targetMonth}
        onChange={(e) =>
          setTargetMonth(e.target.value)
        }
      />

      <input
        type="number"
        placeholder="Year"
        value={targetYear}
        onChange={(e) =>
          setTargetYear(e.target.value)
        }
      />

      <input
        type="number"
        placeholder="Target Amount"
        value={targetAmount}
        onChange={(e) =>
          setTargetAmount(e.target.value)
        }
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px"
        }}
      >
        <button
          className="save-btn"
          onClick={saveTarget}
        >
          Save
        </button>

        <button
          className="cancel-btn"
          onClick={() =>
            setShowTargetModal(false)
          }
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}

{activePage === "payroll" && (
<>
<div
  className="header employees-header"
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  }}
>
    <h1>Payroll Management</h1>

    <button
  className="add-btn"
  onClick={() => setShowAddPayroll(true)}
>
  + Generate Payroll
</button>

  </div>

  <div className="employees-table">

    <table>

      <thead>
        <tr>
          <th>Employee</th>
          <th>Month</th>
          <th>Basic Salary</th>
          <th>Bonus</th>
          <th>Deduction</th>
          <th>Net Salary</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>

        {payrolls.map((payroll) => (
          <tr key={payroll.id}>

            <td>
              {
                employees.find(
                  (emp) => emp.id === payroll.employee_id
                )?.name
              }
            </td>

            <td>{payroll.payroll_month}</td>

            <td>{payroll.basic_salary}</td>

            <td>{payroll.total_bonus}</td>

            <td>{payroll.total_deduction}</td>

            <td>{payroll.net_salary}</td>
<td>
  <button
    onClick={() => exportPayrollPDF(payroll)}
    style={{ marginRight: "10px" }}
  >
    PDF
  </button>

  <button
    onClick={() => deletePayroll(payroll.id)}
  >
    Delete
  </button>
</td>

          </tr>
        ))}

      </tbody>

    </table>

  </div>
  {showAddPayroll && (
  <div className="modal-overlay">
    <div className="modal">

      <h2>Generate Payroll</h2>

      <select
        value={newPayroll.employee_id}
        onChange={(e) =>
          setNewPayroll({
            ...newPayroll,
            employee_id: e.target.value,
          })
        }
      >
        <option value="">
          Select Employee
        </option>

        {employees.map((emp) => (
          <option
            key={emp.id}
            value={emp.id}
          >
            {emp.name}
          </option>
        ))}
      </select>

      <label>Payroll Month</label>

      <input
        type="month"
        value={newPayroll.payroll_month}
        onChange={(e) =>
          setNewPayroll({
            ...newPayroll,
            payroll_month: e.target.value,
          })
        }
      />

      <div className="modal-actions">

        <button
          className="save-btn"
          onClick={() =>
            generatePayroll(
              newPayroll.employee_id,
              newPayroll.payroll_month
            )
          }
        >
          Generate
        </button>

        <button
          className="cancel-btn"
          onClick={() =>
            setShowAddPayroll(false)
          }
        >
          Cancel
        </button>

      </div>

    </div>
  </div>
)}
</>
)}
{activePage === "reports" && (
  <div className="employees-page">

    <div className="header employees-header">
      <h1>Financial Reports</h1>
    </div>

    <div className="card">

    <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px",
    flexWrap: "wrap",
  }}
>

<div className="report-toolbar">

<select
  className="report-filter"
  value={selectedReport}
  onChange={(e) => setSelectedReport(e.target.value)}
>

  <optgroup label="📊 Executive Reports">
    <option value="Executive Summary">Executive Summary</option>
    <option value="Financial Statement">Financial Statement</option>
    <option value="Profitability Analysis">Profitability Analysis</option>
  </optgroup>

  <optgroup label="📑 Financial Statements">
    <option value="Statement of Financial Position">
      Statement of Financial Position
    </option>

    <option value="Income Statement">
      Income Statement
    </option>

    <option value="Cash Flow Statement">
      Cash Flow Statement
    </option>
  </optgroup>

  <optgroup label="💰 Financial Reports">
    <option value="Revenue Report">Revenue Report</option>
    <option value="Expense Report">Expense Report</option>
    <option value="Payroll Report">Payroll Report</option>
    <option value="Financial Transactions">
      Financial Transactions
    </option>
  </optgroup>

  <optgroup label="📈 Performance Reports">
    <option value="Department Performance">
      Department Performance
    </option>

    <option value="Project Report">
      Project Report
    </option>

    <option value="Employee Performance">
      Employee Performance
    </option>
  </optgroup>

</select> 
  <input
    className="report-filter"
    type="date"
    value={reportFrom}
    onChange={(e) => setReportFrom(e.target.value)}
  />

  <input
    className="report-filter"
    type="date"
    value={reportTo}
    onChange={(e) => setReportTo(e.target.value)}
  />

  <div
    style={{
      marginLeft: "auto",
      position: "relative",
    }}
  >
    <button
      className="export-btn"
      onClick={() => setShowExportMenu(!showExportMenu)}
    >
      <FaDownload />
      Export
      <FaChevronDown />
    </button>

    {showExportMenu && (
  <div className="export-menu">

    <div
      className="export-item"
      onClick={() => {
        exportToExcel();
        setShowExportMenu(false);
      }}
    >
      <FaFileExcel />
      <span>Export Excel</span>
    </div>

    <div className="export-item">
      <FaFilePdf />
      <span>Export PDF</span>
    </div>

    <div className="export-item">
      <FaPrint />
      <span>Print Report</span>
    </div>

  </div>
)}
  </div>

</div>

</div>  
{selectedReport === "Executive Summary" && (
  <>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(260px,1fr))",
        gap: "20px",
      }}
    >
      <div className="summary-card revenue-card">
        <h4>Total Revenue</h4>
        <h2>
  <span>{formatNumber(reportTotalRevenue)}</span>
  <small>EGP</small>
</h2>
      </div>

      <div className="summary-card expense-card">
        <h4>Total Expenses</h4>
        <h2>
  <span>{formatNumber(reportTotalExpenses)}</span>
  <small>EGP</small>
</h2>
      </div>

      <div className="summary-card payroll-card">
        <h4>Payroll</h4>
        <h2>
  <span>{formatNumber(reportPayrollExpenses)}</span>
  <small>EGP</small>
</h2>
      </div>

      <div className="summary-card profit-card">
        <h4>Net Profit</h4>
        <h2>
  <span>{formatNumber(reportNetProfit)}</span>
  <small>EGP</small>
</h2>
      </div>

      <div className="summary-card project-card">
        <h4>Projects</h4>
        <h2>{projects.length}</h2>
      </div>

      <div className="summary-card employee-card">
        <h4>Employees</h4>
        <h2>{employees.length}</h2>
      </div>

      <div className="summary-card margin-card">
        <h4>Profit Margin</h4>
        <h2>
          {reportTotalRevenue > 0
            ? ((reportNetProfit / reportTotalRevenue) * 100).toFixed(2)
            : 0}
          %
        </h2>
      </div>

      <div className="summary-card collection-card">
        <h4>Collection Rate</h4>
        <h2>{cashCollectionData.collectionRate.toFixed(2)}%</h2>
      </div>

      <div className="summary-card avg-card">
        <h4>Average Project Revenue</h4>
        <h2>
  <span>
    {projects.length > 0
      ? formatNumber(reportTotalRevenue / projects.length)
      : "0"}
  </span>
  <small>EGP</small>
</h2>
      </div>

      <div className="summary-card revemp-card">
        <h4>Revenue per Employee</h4>
        <h2>
  <span>
    {employees.length > 0
      ? formatNumber(reportTotalRevenue / employees.length)
      : "0"}
  </span>
  <small>EGP</small>
</h2>
      </div>

      <div className="summary-card expratio-card">
        <h4>Expense Ratio</h4>
        <h2>
          {reportTotalRevenue
            ? ((reportTotalExpenses / reportTotalRevenue) * 100).toFixed(2)
            : 0}
          %
        </h2>
      </div>

      <div className="summary-card">
        <h4>Payroll Ratio</h4>
        <h2>
          {reportTotalRevenue
            ? ((reportPayrollExpenses / reportTotalRevenue) * 100).toFixed(2)
            : 0}
          %
        </h2>
      </div>
    </div>

    <div style={{ marginTop: "50px" }}>
      <h2 style={{ marginBottom: "20px" }}>
        Executive Highlights
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(300px,1fr))",
          gap: "20px",
        }}
      >
        <div className="summary-card highlight-card">
          <h4>🏆 Best Department</h4>
          <h2>{bestDepartment?.department || "-"}</h2>
        </div>

        <div className="summary-card highlight-card">
          <h4>📉 Worst Department</h4>
          <h2>{worstDepartment?.department || "-"}</h2>
        </div>

        <div className="summary-card highlight-card">
          <h4>🚀 Most Profitable Project</h4>
          <h2>{bestProject?.project_name || "-"}</h2>
        </div>

        <div className="summary-card highlight-card">
          <h4>👤 Highest Revenue Employee</h4>
          <h2>{highestRevenueEmployee?.name || "-"}</h2>
        </div>

        <div className="summary-card highlight-card">
          <h4>💰 Highest Revenue Category</h4>
          <h2>{highestRevenueCategory?.[0] || "-"}</h2>
        </div>

        <div className="summary-card highlight-card">
          <h4>💸 Highest Expense Category</h4>
          <h2>{highestExpenseCategory?.[0] || "-"}</h2>
        </div>
      </div>
    </div>
  </>
)}

{selectedReport === "Revenue Report" && (
  <>
<h2 style={{ marginTop: "30px" }}>
  Revenue Details
</h2>

<table>
  <thead>
  <tr>
  <th>Date</th>
<th>Project</th>
<th>Category</th>
<th>Payment Method</th>
<th>Department</th>
<th>Employee</th>
<th>Amount</th>
</tr>
  </thead>

  <tbody>
    {filteredRevenues.map((item) => (
      <tr key={item.id}>
  <td>{item.revenue_date}</td>

  <td>{item.project_name}</td>

  <td>
    {
      revenueCategories.find(
        (cat) =>
          Number(cat.id) === Number(item.Revenue_Category_id)
      )?.revenue_categories
    }
  </td>
  <td>
{
  paymentMethods.find(
    (pm) => Number(pm.id) === Number(item.payment_method_id)
  )?.method_name
}
</td>
<td>
{
  departments.find(
    (dep) => dep.id === item.department_id
  )?.department_name
}
</td>
<td>
{
  employees.find(
    (emp) => emp.id === item.employee_id
  )?.name
}
</td>

  <td>
    {Number(item.amount).toLocaleString()}
  </td>
</tr>
    ))}
  </tbody>
</table>
</>
)}
{selectedReport === "Expense Report" && (
  <>
<h2 style={{ marginTop: "30px" }}>
  Expense Details
</h2>

<table>
  <thead>
    <tr>
    <th>Date</th>
<th>Project</th>
<th>Category</th>
<th>Payment Method</th>
<th>Department</th>
<th>Employee</th>
<th>Amount</th>
    </tr>
  </thead>

  <tbody>
    {filteredExpenses.map((item) => (
      <tr key={item.id}>
<td>{item.expense_date}</td>

<td>{item.project_name}</td>

<td>
{
  expenseCategories.find(
    (cat) => Number(cat.id) === Number(item.expense_category_id)
  )?.expense_categories
}
</td>

<td>
{
  paymentMethods.find(
    (pm) => Number(pm.id) === Number(item.payment_method_id)
  )?.method_name
}
</td>

<td>
{
  item.project_name === "Monthly Salaries"
    ? "All Departments"
    : departments.find(
        (dep) => dep.id === item.department_id
      )?.department_name
}
</td>

<td>
{
  item.project_name === "Monthly Salaries"
    ? "Company Payroll"
    : employees.find(
        (emp) => emp.id === item.employee_id
      )?.name
}
</td>

<td>
  {Number(item.amount).toLocaleString()}
</td>

      </tr>
    ))}
  </tbody>
</table>
</>
)}
{selectedReport === "Department Performance" && (
  <>
<h2 style={{ marginTop: "40px" }}>
  Department Cost Analysis
</h2>

<table>
<thead>
  <tr>
    <th>Department</th>
    <th>Revenue</th>
    <th>Expenses</th>
    <th>Payroll</th>
    <th>Total Cost</th>
    <th>Net Profit</th>
    <th>Profit %</th>
  </tr>
</thead>

  <tbody>
    {departmentAnalysis.map((item) => (
      <tr key={item.department}>
        <td>{item.department}</td>

        <td>
          {item.revenue.toLocaleString()}
        </td>

        <td>
          {item.expenses.toLocaleString()}
        </td>

        <td>
          {item.payroll.toLocaleString()}
        </td>

        <td>
          {item.totalCost.toLocaleString()}
        </td>

        <td>
          {item.profit.toLocaleString()}
        </td>

        <td>
  {item.profitMargin.toFixed(2)}%
</td>

      </tr>
    ))}
  </tbody>
</table>
<h2 style={{ marginTop: "40px" }}>
  Department Target Analysis
</h2>

<table>
  <thead>
    <tr>
      <th>Department</th>
      <th>Target</th>
      <th>Actual Revenue</th>
      <th>Variance</th>
      <th>Achievement %</th>
    </tr>
  </thead>

  <tbody>
    {departmentTargetAnalysis.map((item, index) => (
      <tr key={index}>
        <td>{item.department}</td>
        <td>{item.target.toLocaleString()}</td>
        <td>{item.actualRevenue.toLocaleString()}</td>
        <td>{item.variance.toLocaleString()}</td>
        <td>{item.achievement.toFixed(2)}%</td>
      </tr>
    ))}
  </tbody>
</table>
</>
)}

    </div>

  </div>
)}

      {activePage === "dashboard" && (
        <>
      <div className="header">

<h1>Executive Management Dashboard</h1>

<div className="header-right">

  <select
    value={selectedYear}
    onChange={(e) =>
      setSelectedYear(e.target.value)
    }
    className="year-filter"
  >
    <option value="All">All Years</option>

    {availableYears.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
  </select>

  <span>
    {currentTime.toLocaleDateString("en-GB")}
  </span>

  <span>
    {currentTime.toLocaleTimeString()}
  </span>

</div>

</div>

        <div className="kpis">

        <div className="kpi">
  <FaUsers className="kpi-icon" />

  <span>Employees</span>

  <h2>{employees.length}</h2>
</div>
<div className="kpi">
  <FaMoneyBillWave className="kpi-icon" />

  <span>Payroll</span>

  <h2>
    {totalPayroll.toLocaleString()}
  </h2>
</div>

<div className="kpi">
  <FaChartLine className="kpi-icon" />
  <span>Revenue</span>
  <h2>{totalRevenue.toLocaleString()}</h2>
</div>

<div className="kpi">
  <FaWallet className="kpi-icon" />
  <span>Expenses</span>
  <h2>{totalExpenses.toLocaleString()}</h2>
</div>

<div className="kpi">
  <FaDollarSign className="kpi-icon" />
  <span>Profit</span>
  <h2>{netProfit.toLocaleString()}</h2>
</div>

<div className="kpi">
  <FaProjectDiagram className="kpi-icon" />
  <span>Projects</span>
  <h2>{revenues.length}</h2>
</div>

        </div>
        <div className="charts-grid">

        <div
  className="chart-panel"
  style={{ position: "relative" }}
>
  <div className="chart-title">
  Revenue Analysis
  <div
  style={{
    textAlign: "center",
    color: "#94A3B8",
    marginTop: "-10px",
    marginBottom: "20px",
    fontSize: "18px",
    fontWeight: "600",
  }}
>
</div>
</div>


    <ResponsiveContainer width="100%" height={350}>
  <PieChart>

    <Pie
      data={revenueChartData}
      dataKey="amount"
      nameKey="name"
      cx="25%"
      cy="57%"
      innerRadius={80}
      outerRadius={150}
      stroke="#0B1120"
      strokeWidth={2}

    >

{revenueChartData.map((entry) => (
  <Cell
    key={entry.name}
    fill={DEPARTMENT_COLORS[entry.name] || "#64748B"}
  />
))}

    </Pie>

    <Tooltip
  cursor={false}
  contentStyle={{
    backgroundColor: "#141C2E",
    border: "1px solid #3A455E",
    borderRadius: "18px",
    color: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
  }}
  labelStyle={{
    color: "#fff",
    fontSize: 18,
    fontWeight: 700,
  }}
  itemStyle={{
    fontSize: 16,
    fontWeight: 600,
  }}
/>

<text
  x="25%"
  y="55%"
  textAnchor="middle"
  fill="#BFBFBF"
  fontSize={12}
>
  Total Revenue
</text>

<text
  x="25%"
  y="62%"
  textAnchor="middle"
  fill="#8BE000"
  fontSize={18}
  fontWeight="bold"
>
{totalRevenueValue.toLocaleString()}
</text>


  </PieChart>
</ResponsiveContainer>
<div
  style={{
    position: "absolute",
    right: "40px",
    top: "150px",
    width: "320px",
  }}
>
{revenueChartData.map((item) => {

const percentage =
  ((item.amount / totalRevenueValue) * 100).toFixed(1);

return (
  <div
    key={item.name}
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 0",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <div
        style={{
          width: "14px",
          height: "14px",
          borderRadius: "4px",
          background: DEPARTMENT_COLORS[item.name] || "#64748B",
        }}
      />

      <span
        style={{
          color: "#fff",
          fontSize: "18px",
        }}
      >
        {item.name}
      </span>
    </div>

    <div style={{ textAlign: "right" }}>
      <div
        style={{
          color: "#fff",
          fontWeight: "600",
        }}
      >
        {item.amount.toLocaleString()}
      </div>

      <div
        style={{
          color: DEPARTMENT_COLORS[item.name] || "#64748B",
          fontWeight: "bold",
        }}
      >
        {percentage}%
      </div>
    </div>
  </div>
);
})} 
</div>
  </div>

  <div
  className="chart-panel"
  style={{ position: "relative" }}
>
  <div className="chart-title">
  Expense Analysis
</div>

<div
  style={{
    textAlign: "center",
    color: "#94A3B8",
    marginTop: "-10px",
    marginBottom: "20px",
    fontSize: "18px",
    fontWeight: "600",
  }}
>
</div>

<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "420px",
  }}
>
  <ResponsiveContainer width="100%" height={350}>
    <PieChart>
      <Pie
        data={expenseChartData}
        dataKey="amount"
        nameKey="name"
        cx="25%"
        cy="48%"
        innerRadius={80}
        outerRadius={150}
        stroke="#0B1120"
        strokeWidth={2}
      >
       {expenseChartData.map((entry) => (
  <Cell
    key={entry.name}
    fill={DEPARTMENT_COLORS[entry.name] || "#64748B"}
  />
))}
      </Pie>

      <Tooltip
  cursor={false}
  contentStyle={{
    backgroundColor: "#141C2E",
    border: "1px solid #3A455E",
    borderRadius: "18px",
    color: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
  }}
  labelStyle={{
    color: "#fff",
    fontSize: 18,
    fontWeight: 700,
  }}
  itemStyle={{
    fontSize: 16,
    fontWeight: 600,
  }}
/>
          <text
  x="25%"
  y="47%"
  textAnchor="middle"
  fill="#BFBFBF"
  fontSize={12}
>
  Total Expenses
</text>

<text
  x="25%"
  y="54%"
  textAnchor="middle"
  fill="#8BE000"
  fontSize={18}
  fontWeight="bold"
>
  {totalExpenseValue.toLocaleString()}
</text>
    </PieChart>

  </ResponsiveContainer>
  <div
  style={{
    position: "absolute",
    right: "40px",
    top: "150px",
    width: "320px",
  }}
>
{expenseChartData.map((item) => {

const percentage =
  ((item.amount / totalExpenseValue) * 100).toFixed(1);

return (
  <div
    key={item.name}
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 0",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <div
        style={{
          width: "14px",
          height: "14px",
          borderRadius: "4px",
          background: DEPARTMENT_COLORS[item.name] || "#64748B",
        }}
      />

      <span
        style={{
          color: "#fff",
          fontSize: "18px",
        }}
      >
        {item.name}
      </span>
    </div>

    <div style={{ textAlign: "right" }}>
      <div
        style={{
          color: "#fff",
          fontWeight: "600",
        }}
      >
        {item.amount.toLocaleString()}
      </div>

      <div
        style={{
          color: DEPARTMENT_COLORS[item.name] || "#64748B",
          fontWeight: "bold",
        }}
      >
        {percentage}%
      </div>
    </div>
  </div>
);
})} 
</div>
</div>
  </div>

</div>
{/* Monthly Trends */}

<div className="trend-row">

<div className="chart-card">
  <h2>Monthly Financial Performance</h2>

  <ResponsiveContainer width="100%" height={420}>
  <BarChart
  data={monthlyFinancialData}
  barGap={8}
  barCategoryGap="30%"
>
    <CartesianGrid strokeDasharray="3 3" />

    <XAxis
  dataKey="month"
  tick={{ fill: "#9CA3AF", fontSize: 13 }}
/>

    <YAxis
  tick={{ fill: "#9CA3AF", fontSize: 12 }}
  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
/>

<Tooltip
  cursor={{
    fill: "#07111F",
    fillOpacity: 1,
  }}
  content={({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const revenue = payload.find(p => p.dataKey === "revenue");
    const expenses = payload.find(p => p.dataKey === "expenses");
    const profit = payload.find(p => p.dataKey === "profit");

    return (
      <div
        style={{
          background: "#141C2E",
          border: "1px solid #3A455E",
          borderRadius: 18,
          padding: 18,
        }}
      >
        <div
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          {label}
        </div>

        <div style={{ color: "#FF00E5", fontSize: 16 }}>
          Revenue : {revenue?.value?.toLocaleString()}
        </div>

        <div style={{ color: "#BFBFBF", fontSize: 16 }}>
          Expenses : {expenses?.value?.toLocaleString()}
        </div>

        <div style={{ color: "#84CC16", fontSize: 16 }}>
          Net Profit : {profit?.value?.toLocaleString()}
        </div>
      </div>
    );
  }}
/>

<Bar
  dataKey="revenue"
  name="Revenue"
  fill="#FF00E5"
  barSize={32}
/>

<Bar
  dataKey="expenses"
  name="Expenses"
  fill="#BFBFBF"
  barSize={32}
/>

<Bar
  dataKey="profit"
  name="Net Profit"
  fill="#84CC16"
  barSize={32}
>
  <LabelList
    dataKey="profit"
    position="top"
    formatter={(v) => (v ? `${Math.round(v / 1000)}K` : "")}
    fill="#84CC16"
    fontSize={18}
  />
</Bar>
  

  </BarChart>
</ResponsiveContainer>
<div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "35px",
    marginTop: "18px",
    fontSize: "18px",
    fontWeight: 500,
  }}
>
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div
      style={{
        width: 16,
        height: 16,
        background: "#FF00E5",
      }}
    />
    <span style={{ color: "#FF00E5" }}>Revenue</span>
  </div>

  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div
      style={{
        width: 16,
        height: 16,
        background: "#BFBFBF",
      }}
    />
    <span style={{ color: "#BFBFBF" }}>Expenses</span>
  </div>

  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div
      style={{
        width: 16,
        height: 16,
        background: "#84CC16",
      }}
    />
    <span style={{ color: "#84CC16" }}>Net Profit</span>
  </div>
</div>
  </div>

  <div className="chart-card">

<h2>Net Profit Trend</h2>

<ResponsiveContainer width="100%" height={420}>
  <LineChart data={monthlyFinancialData}>

    <CartesianGrid stroke="#334155" strokeDasharray="4 4" />

    <XAxis
      dataKey="month"
      tick={{ fill: "#9CA3AF", fontSize: 13 }}
    />

    <YAxis
      tick={{ fill: "#9CA3AF", fontSize: 12 }}
      tickFormatter={(v) => `${Math.round(v / 1000)}K`}
    />

    <Tooltip
      formatter={(v) => Number(v).toLocaleString()}
      contentStyle={{
        background: "#111827",
        border: "1px solid #334155",
        borderRadius: 10,
        color: "#fff",
      }}
    />


    <Line
      type="monotone"
      dataKey="profit"
      name="Net Profit"
      stroke="#84CC16"
      strokeWidth={4}
      dot={{
        fill: "#84CC16",
        r: 5,
        stroke: "#fff",
        strokeWidth: 2,
      }}
      activeDot={{
        r: 8,
        fill: "#84CC16",
        stroke: "#fff",
        strokeWidth: 2,
      }}
    />

  </LineChart>
</ResponsiveContainer>
<div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
    marginBottom: "10px",
    fontSize: "18px",
    fontWeight: 500,
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}
  >
  

    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: "#84CC16",
      }}
    />

    <span style={{ color: "#84CC16" }}>
      Net Profit
    </span>
  </div>
</div>

</div>

</div>
        <div className="dashboard-grid">

        <div className="panel">
  <h2>Department Profit Contribution</h2>

  <ResponsiveContainer width="100%" height={350}>
    <ComposedChart data={departmentProfitChartData}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="department" />


      <YAxis
        yAxisId="right"
        orientation="right"
        hide={true}
      />

<Tooltip
  cursor={{
    fill: "#07111F",
    fillOpacity: 1,
  }}
  content={({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;

    return (
      <div
        style={{
          background: "#141C2E",
          border: "1px solid #3A455E",
          borderRadius: 18,
          padding: 18,
        }}
      >
        <div
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          {label}
        </div>

        <div
          style={{
            color: data.color,
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          Net Profit : {Number(data.profit || 0).toLocaleString()}
        </div>

        <div
          style={{
            color: "#FF5A5F",
            fontSize: 16,
            fontWeight: 600,
            marginTop: 8,
          }}
        >
          Contribution : {(data.contribution || 0).toFixed(2)}%
        </div>
      </div>
    );
  }}
/>

<Legend
  wrapperStyle={{
    color: "#1E90FF",
    fontSize: "18px",
  }}
/>

<Bar
  yAxisId="left"
  dataKey="profit"
  name="Net Profit"
  fill="#8BE000"
>

  {departmentProfitChartData.map((entry, index) => (
    <Cell
      key={index}
      fill={entry.color}
    />
    
  ))}

  <LabelList
    dataKey="contribution"
    position="top"
    formatter={(value) => `${value}%`}
  />
</Bar>

<Line
  yAxisId="right"
  type="monotone"
  dataKey="contribution"
  name="% Contribution"
  stroke="#FF4D4F"
  strokeWidth={3}
  dot={{ fill: "#FF4D4F", r: 5 }}
  activeDot={{ r: 7 }}
/>
    </ComposedChart>
  </ResponsiveContainer>
</div>

<div className="panel">
  <h2>Revenue vs Target</h2>

  <ResponsiveContainer
    width="100%"
    height={350}
  >
    <ComposedChart
      data={departmentTargetChartData}
    >
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="department" />

      <YAxis
  yAxisId="left"
  hide={true}
/>

      <YAxis
        yAxisId="right"
        orientation="right"
        hide={true}
      />

<Tooltip
  cursor={{
    fill: "#07111F",
    fillOpacity: 1,
  }}
  content={({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const actual = payload.find((p) => p.dataKey === "actualRevenue");
    const target = payload.find((p) => p.dataKey === "target");
    const achievement = payload.find((p) => p.dataKey === "achievement");

    return (
      <div
        style={{
          background: "#141C2E",
          border: "1px solid #3A455E",
          borderRadius: 18,
          padding: 18,
        }}
      >
        <div
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          {label}
        </div>

        <div style={{ color: "#84CC16", fontSize: 16 }}>
          Actual Revenue : {Number(actual?.value).toLocaleString()}
        </div>

        <div style={{ color: "#3B82F6", fontSize: 16 }}>
          Target : {Number(target?.value).toLocaleString()}
        </div>

        <div style={{ color: "#FF5A5F", fontSize: 16 }}>
          Achievement : {achievement?.value}%
        </div>
      </div>
    );
  }}
/>

      <Legend
        wrapperStyle={{
          fontSize: "18px",
        }}
      />

      <Bar
        yAxisId="left"
        dataKey="actualRevenue"
        name="Actual Revenue"
        fill="#8BE000"
      >
        {departmentTargetChartData.map(
          (entry, index) => (
            <Cell
              key={index}
              fill={entry.color}
            />
          )
        )}
      </Bar>
      <Bar
  yAxisId="left"
  dataKey="target"
  name="Target"
  fill="#1E90FF"
  barSize={50}
>

  {departmentTargetChartData.map(
    (entry, index) => (
      <Cell
        key={index}
        fill="#1E90FF"
      />
    )
  )}

<LabelList
  dataKey="achievement"
  content={(props) => {
    const {
      x,
      y,
      width,
      value,
      index,
    } = props;

    return (
      <text
        x={x + width / 2}
        y={y - 25}
        textAnchor="middle"
        fill={departmentTargetChartData[index]?.color}
        fontSize={18}
      >
        {Number(value).toFixed(0)}%
      </text>
    );
  }}
/>
</Bar>

<Line
  yAxisId="right"
  type="monotone"
  dataKey="achievement"
  name="Achievement %"
  stroke="#FF4D4F"
  strokeWidth={3}
  dot={{ fill: "#FF4D4F", r: 5 }}
  activeDot={{
    r: 8,
    fill: "#FF4D4F",
    stroke: "#fff",
    strokeWidth: 2,
  }}
  label={(props) => {
    const { x, y, value } = props;

    return (
      <text
        x={x}
        y={y - 10}
        textAnchor="middle"
        fill="#FF4D4F"
        fontSize="18"
        fontWeight="bold"
      >
        {Number(value).toFixed(2)}%
      </text>
    );
  }}
/>
    </ComposedChart>
  </ResponsiveContainer>
</div>     

<div className="chart-card">
  <h2>Top 5 Projects by Revenue</h2>
  <ResponsiveContainer width="100%" height={447}>
  <BarChart
    data={topProjectsRevenue}
    layout="vertical"
    margin={{ top: 20, right: 40, left: 40, bottom: 20 }}
  >
    <CartesianGrid strokeDasharray="3 3" stroke="#555" />

    <XAxis
      type="number"
      stroke="#fff"
    />

    <YAxis
      dataKey="project_name"
      type="category"
      stroke="#fff"
      width={150}
    />

<Tooltip
  cursor={{ fill: "transparent" }}
  contentStyle={{
    backgroundColor: "#111827",
    border: "none",
    borderRadius: "14px",
    boxShadow: "0 8px 20px rgba(0,0,0,.35)",
  }}
  labelStyle={{
    color: "#fff",
    fontWeight: 600,
  }}
  itemStyle={{
    color: "#84CC16",
  }}
/>

    <Bar
      dataKey="revenue"
      fill="#84cc16"
      radius={[0, 8, 8, 0]}
    />
  </BarChart>
</ResponsiveContainer>

</div>       

<div className="panel cash-panel">
          <div className="chart-card">
  <h2>Cash Collection Rate</h2>

  <ResponsiveContainer width="100%" height={340}>
    <RadialBarChart
      innerRadius="70%"
      outerRadius="95%"
      data={[
        {
          name: "Collection",
          value: cashCollectionData.collectionRate,
          fill: "#84CC16",
        },
      ]}
      startAngle={90}
      endAngle={-270}
    >
      <PolarAngleAxis
        type="number"
        domain={[0, 100]}
        angleAxisId={0}
        tick={false}
      />
<RadialBar
  dataKey="value"
  cornerRadius={15}
/>
      <text
        x="50%"
        y="47%"
        textAnchor="middle"
        fill="#fff"
        fontSize="18"
        fontWeight="600"
      >
        Collection
      </text>

      <text
        x="50%"
        y="58%"
        textAnchor="middle"
        fill="#84CC16"
        fontSize="34"
        fontWeight="700"
      >
        {cashCollectionData.collectionRate.toFixed(1)}%
      </text>
    </RadialBarChart>
  </ResponsiveContainer>


  <div className="summary-grid">

    <div className="summary-item">
      <span>Total Due</span>
      <strong>
      {cashCollectionData.totalDue.toLocaleString()}
      </strong>
    </div>

    <div className="summary-item">
      <span>Collected</span>
      <strong style={{ color: "#84CC16" }}>
        {cashCollectionData.totalCollected.toLocaleString()}
      </strong>
    </div>

    <div className="summary-item">
      <span>Remaining</span>
      <strong style={{ color: "#FF4D4F" }}>
        {cashCollectionData.totalRemaining.toLocaleString()}
      </strong>
    </div>

  </div>
</div>  
          </div>

        </div>
        </>
)}
      </main>
    </div>
  );
}

export default App;