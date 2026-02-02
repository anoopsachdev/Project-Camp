const BASE_URL = "http://localhost:8000/api/v1"; // Assuming port 8000 based on common patterns, check env later if needed
let accessToken = "";
let projectId = "";
let taskId = "";
let noteId = "";
let subTaskId = "";

const adminEmail = "admin@example.com";
const adminPassword = "password123";

// Helper to log steps
const step = (msg) => console.log(`[STEP] ${msg}`);

async function run() {
  try {
    // 0. Register (if not exists) & Login
    step("Logging in...");
    // Try login first
    let res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: adminEmail, password: adminPassword }),
    });

    if (res.status === 404 || res.status === 400 || res.status === 401) {
      // Try register
      step("Registering new admin...");
      const regRes = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Fixed: username lowercase
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
          username: "adminuser",
          fullName: "Admin User",
          role: "admin",
        }),
      });

      if (!regRes.ok) {
        throw new Error(
          `Registration failed: ${regRes.status} ${await regRes.text()}`,
        );
      }
      console.log("Registered.");

      // Then login
      res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
    }

    if (!res.ok)
      throw new Error(`Login failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    accessToken = data.data.accessToken;
    console.log("Logged in.");

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    // 1. Create Project
    step("Creating Project...");
    const projectName = `Test Project ${Date.now()}`;
    res = await fetch(`${BASE_URL}/projects`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: projectName,
        description: "Test Description",
      }),
    });
    if (!res.ok) throw new Error(`Create Project failed: ${await res.text()}`);
    const projectData = await res.json();
    projectId = projectData.data._id;
    console.log(`Project Created: ${projectId}`);

    // 2. Create Note
    step("Creating Note...");
    res = await fetch(`${BASE_URL}/notes/${projectId}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ content: "This is a test note" }),
    });
    if (!res.ok) throw new Error(`Create Note failed: ${await res.text()}`);
    const noteData = await res.json();
    noteId = noteData.data._id;
    console.log(`Note Created: ${noteId}`);

    // 3. Get Notes
    step("Getting Notes...");
    res = await fetch(`${BASE_URL}/notes/${projectId}`, { headers });
    if (!res.ok) throw new Error(`Get Notes failed: ${await res.text()}`);
    console.log("Notes Fetched.");

    // 4. Update Note
    step("Updating Note...");
    res = await fetch(`${BASE_URL}/notes/${projectId}/n/${noteId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ content: "Updated Note Content" }),
    });
    if (!res.ok) throw new Error(`Update Note failed: ${await res.text()}`);
    console.log("Note Updated.");

    // 5. Create Task
    step("Creating Task...");
    res = await fetch(`${BASE_URL}/tasks/${projectId}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: "Test Task",
        description: "Task Desc",
        status: "todo",
      }),
    });
    if (!res.ok) throw new Error(`Create Task failed: ${await res.text()}`);
    const taskData = await res.json();
    taskId = taskData.data._id;
    console.log(`Task Created: ${taskId}`);

    // 6. Create Subtask
    step("Creating Subtask...");
    res = await fetch(`${BASE_URL}/tasks/${projectId}/t/${taskId}/subtasks`, {
      method: "POST",
      headers,
      body: JSON.stringify({ title: "Subtask 1" }),
    });
    if (!res.ok) throw new Error(`Create Subtask failed: ${await res.text()}`);
    const subtaskData = await res.json();
    subTaskId = subtaskData.data._id;
    console.log(`Subtask Created: ${subTaskId}`);

    // 7. Update Subtask
    step("Updating Subtask...");
    res = await fetch(`${BASE_URL}/tasks/${projectId}/st/${subTaskId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ title: "Updated Subtask", isCompleted: true }),
    });
    if (!res.ok) throw new Error(`Update Subtask failed: ${await res.text()}`);
    console.log("Subtask Updated.");

    // 8. Delete Subtask
    step("Deleting Subtask...");
    res = await fetch(`${BASE_URL}/tasks/${projectId}/st/${subTaskId}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new Error(`Delete Subtask failed: ${await res.text()}`);
    console.log("Subtask Deleted.");

    // 9. Delete Task
    step("Deleting Task...");
    res = await fetch(`${BASE_URL}/tasks/${projectId}/t/${taskId}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new Error(`Delete Task failed: ${await res.text()}`);
    console.log("Task Deleted.");

    // 10. Delete Note
    step("Deleting Note...");
    res = await fetch(`${BASE_URL}/notes/${projectId}/n/${noteId}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new Error(`Delete Note failed: ${await res.text()}`);
    console.log("Note Deleted.");

    // 11. cleanup Project
    step("Deleting Project...");
    res = await fetch(`${BASE_URL}/projects/${projectId}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new Error(`Delete Project failed: ${await res.text()}`);
    console.log("Project Deleted.");

    console.log("\nVERIFICATION SUCCESSFUL: All steps passed!");
  } catch (err) {
    console.error("\nVERIFICATION FAILED:", err.message);
    process.exit(1);
  }
}

run();
