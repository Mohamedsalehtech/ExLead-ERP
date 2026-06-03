import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./App.css";

import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
  FaCreditCard,
  FaChartBar,
  FaCog
} from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
function App() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [revenueCategories, setRevenueCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activePage, setActivePage] = useState("dashboard");
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showAddDepartment, setShowAddDepartment] = useState(false);

const [newDepartment, setNewDepartment] = useState({
  department_name: "",
});

const [editingDepartment, setEditingDepartment] = useState(null);
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
  });

  useEffect(() => {
    loadData();
  
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
  
    return () => clearInterval(timer);
  
  }, []);

  async function loadData() {
    const { data: employeesData } = await supabase
    .from("employees")
    .select(`
      *,
      departments (
        department_name
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

    const { data: revenuesData } = await supabase
      .from("revenues")
      .select("*")
      .order("revenue_date", { ascending: false });
      const { data: paymentMethodsData } =
await supabase
.from("payment_methods")
.select("*");

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
      setEmployees(sortedEmployees);
    setDepartments(departmentsData || []);
    setRevenues(revenuesData || []);
    setPaymentMethods(paymentMethodsData || []);
setRevenueCategories(revenueCategoriesData || []);
setExpenseCategories(expenseCategoriesData || []);
    setExpenses(expensesData || []);
  }

  const totalRevenue = revenues.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalExpenses = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const netProfit = totalRevenue - totalExpenses;
  const revenueChartData = revenues.map(item => ({
    name: item.project_name,
    amount: Number(item.amount)
  }));
  
  const expenseChartData = expenses.map(item => ({
    name: item.project_name,
    amount: Number(item.amount)
  }));
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
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">EXLEAD</div>

        <ul className="menu">

        <li
  className={activePage === "dashboard" ? "active" : ""}
  onClick={() => setActivePage("dashboard")}
>
  <FaHome />
  <span>Dashboard</span>
</li>
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
  className={activePage === "revenues" ? "active" : ""}
  onClick={() => setActivePage("revenues")}
>
  <FaMoneyBillWave />
  <span>Revenues</span>
</li>

<li
  className={activePage === "expenses" ? "active" : ""}
  onClick={() => setActivePage("expenses")}
>
  <FaMoneyBillWave />
  <span>Expenses</span>
</li>

<li>
  <FaCreditCard />
  <span>Payroll</span>
</li>

<li>
  <FaChartBar />
  <span>Reports</span>
</li>

<li>
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
      onClick={() => setShowAddEmployee(true)}
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

    setNewEmployee({
      name: emp.name || "",
      phone: emp.phone || "",
      email: emp.email || "",
      position: emp.position || "",
      department_id: emp.department_id || "",
      basic_salary: emp.basic_salary || "",
      hire_date: emp.hire_date || "",
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

      <h2>Add Employee</h2>

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
  onClick={() => {
    if (editingEmployee) {
      updateEmployee();
    } else {
      addEmployee();
    }
  }}
>
  Save
</button>

        <button
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

    <div className="table-container">

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

  <div className="table-container">

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

  <div className="table-container">

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

      {activePage === "dashboard" && (
        <>
      <div className="header">

<h1>Executive Management Dashboard</h1>

<div className="header-right">

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
            <span>Employees</span>
            <h2>{employees.length}</h2>
          </div>

          <div className="kpi">
            <span>Departments</span>
            <h2>{departments.length}</h2>
          </div>

          <div className="kpi">
            <span>Revenue</span>
            <h2>{totalRevenue.toLocaleString()}</h2>
          </div>

          <div className="kpi">
            <span>Expenses</span>
            <h2>{totalExpenses.toLocaleString()}</h2>
          </div>

          <div className="kpi">
            <span>Profit</span>
            <h2>{netProfit.toLocaleString()}</h2>
          </div>

          <div className="kpi">
            <span>Projects</span>
            <h2>{revenues.length}</h2>
          </div>

        </div>
        <div className="charts-grid">

  <div className="chart-panel">
    <div className="chart-title">Revenue Analysis</div>

    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={revenueChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="amount" fill="#84CC16" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  <div className="chart-panel">
    <div className="chart-title">Expense Analysis</div>

    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={expenseChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="amount" fill="#EF4444" />
      </BarChart>
    </ResponsiveContainer>
  </div>

</div>

        <div className="dashboard-grid">

          <div className="panel">
            <h2>Latest Revenues</h2>

            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {revenues.slice(0, 10).map((item) => (
                  <tr key={item.id}>
                    <td>{item.project_name}</td>
                    <td>{Number(item.amount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <h2>Latest Expenses</h2>

            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {expenses.slice(0, 10).map((item) => (
                  <tr key={item.id}>
                    <td>{item.project_name}</td>
                    <td>{Number(item.amount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <h2>Employees</h2>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.name}</td>
                    <td>{emp.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <h2>Company Summary</h2>

            <div className="stats">
              <p>Total Employees: {employees.length}</p>
              <p>Total Departments: {departments.length}</p>
              <p>Total Revenue: {totalRevenue.toLocaleString()}</p>
              <p>Total Expenses: {totalExpenses.toLocaleString()}</p>
              <p>Net Profit: {netProfit.toLocaleString()}</p>
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