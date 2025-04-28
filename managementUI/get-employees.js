let employeesData = [];

// Fetch all employees
fetch('/employee/data')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    employeesData = data;
    console.log("Employees data loaded:", employeesData);
    displayAllEmployees();
  })
  .catch((err) => console.error("Error loading employees:", err));

function displayAllEmployees() {
  const employeeContainer = document.getElementById('employeeContainer');
  employeeContainer.innerHTML = '';

  employeesData
    .filter((employee) => !employee.is_deleted)
    .forEach((employee) => {
      const employeeDiv = document.createElement('div');
      employeeDiv.className = 'employeeCard';

      employeeDiv.innerHTML = `
        <p><strong>Employee ID:</strong> ${employee.id}</p>
        <label>First Name: <input type="text" class="firstName" value="${employee.first_name}"></label>
        <label>Last Name: <input type="text" class="lastName" value="${employee.last_name}"></label>
        <label>Email: <input type="email" class="email" value="${employee.email}"></label>
        <label>Manager: <input type="checkbox" class="isManager" ${employee.is_manager ? 'checked' : ''}></label>
        <button class="updateBtn" onclick="updateEmployee(${employee.id})">Update</button>
        <button class="deleteBtn" onclick="deleteEmployee(${employee.id})">Delete</button>
      `;

      employeeContainer.appendChild(employeeDiv);
    });
}

// Update an employee
function updateEmployee(employeeId) {
  const employeeDiv = document.getElementById(`employee-${employeeId}`);
  const firstName = employeeDiv.querySelector('.firstName').value;
  const lastName = employeeDiv.querySelector('.lastName').value;
  const email = employeeDiv.querySelector('.email').value;
  const isManager = employeeDiv.querySelector('.isManager').checked;

    fetch(`/employee/edit/${employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, email, is_manager: isManager })
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      alert('Employee updated successfully!');
      location.reload(); // Reload the page to see the updated employee details
    })
    .catch((err) => console.error('Error updating employee:', err));
  }

  function deleteEmployee(employeeId) {
    fetch(`/employee/delete/${employeeId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(() => {
        alert("Employee deleted successfully!");
        const employeeContainer = document.getElementById('employeeContainer');
        employeeContainer.innerHTML = '';
        location.reload(); // Reload the page to see the updated employee list
      })
      .catch(err => console.error("Error deleting employee:", err));
  }

// Add a new employee
function addEmployee() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const isManager = document.getElementById('isManager').checked;

    fetch('/employee/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, email, is_manager: isManager })
    })
      .then(response => response.json())
      .then(() => {
        alert("Employee added successfully!");
        location.reload(); // Reload the page to see the new employee in the dropdown
      })
      .catch(err => console.error("Error adding employee:", err));
  }

  window.updateEmployee = updateEmployee;
  window.deleteEmployee = deleteEmployee;