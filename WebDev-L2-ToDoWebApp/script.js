const STORAGE_KEY = 'bloom-tasks-v1';
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const pendingList = document.getElementById('pendingList');
const completedList = document.getElementById('completedList');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');

let tasks = loadTasks();
let editingId = null;

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn('Unable to load tasks:', error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function formatTimestamp(value) {
  if (!value) return 'Just added';
  const date = new Date(value);
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

function createTask(text) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text,
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null
  };
}

function updateCounts() {
  const pending = tasks.filter((task) => !task.completed);
  const completed = tasks.filter((task) => task.completed);

  pendingCount.textContent = `${pending.length} pending`;
  completedCount.textContent = `${completed.length} completed`;
}

function renderEmptyState(listElement, message) {
  const emptyState = document.createElement('li');
  emptyState.className = 'empty-state';
  emptyState.textContent = message;
  listElement.appendChild(emptyState);
}

function createTaskElement(task) {
  const listItem = document.createElement('li');
  listItem.className = `task-item ${task.completed ? 'completed' : ''} ${editingId === task.id ? 'editing' : ''}`;

  const mainContent = document.createElement('div');
  mainContent.className = 'task-main';

  const toggle = document.createElement('input');
  toggle.type = 'checkbox';
  toggle.className = 'task-toggle';
  toggle.checked = task.completed;
  toggle.dataset.id = task.id;

  const content = document.createElement('div');
  content.className = 'task-content';

  if (editingId === task.id) {
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = task.text;
    editInput.dataset.id = task.id;
    content.appendChild(editInput);

    const actionRow = document.createElement('div');
    actionRow.className = 'task-actions';

    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.className = 'save-btn';
    saveButton.textContent = 'Save';
    saveButton.dataset.id = task.id;

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'cancel-btn';
    cancelButton.textContent = 'Cancel';
    cancelButton.dataset.id = task.id;

    actionRow.append(saveButton, cancelButton);
    content.appendChild(actionRow);
  } else {
    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;
    content.appendChild(text);
  }

  const meta = document.createElement('p');
  meta.className = 'task-meta';
  meta.textContent = task.completed
    ? `Completed • ${formatTimestamp(task.completedAt || task.createdAt)}`
    : `Added • ${formatTimestamp(task.createdAt)}`;
  content.appendChild(meta);

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  if (!task.completed) {
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'edit-btn';
    editButton.textContent = 'Edit';
    editButton.dataset.id = task.id;
    actions.appendChild(editButton);
  }

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-btn';
  deleteButton.textContent = 'Delete';
  deleteButton.dataset.id = task.id;
  actions.appendChild(deleteButton);

  mainContent.append(toggle, content);
  listItem.append(mainContent, actions);

  return listItem;
}

function render() {
  pendingList.innerHTML = '';
  completedList.innerHTML = '';

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  if (pendingTasks.length === 0) {
    renderEmptyState(pendingList, 'No pending tasks — your calm is already showing.');
  } else {
    pendingTasks.forEach((task) => pendingList.appendChild(createTaskElement(task)));
  }

  if (completedTasks.length === 0) {
    renderEmptyState(completedList, 'Nothing completed yet — one step at a time.');
  } else {
    completedTasks.forEach((task) => completedList.appendChild(createTaskElement(task)));
  }

  updateCounts();
}

function addTask(text) {
  const trimmedText = text.trim();
  if (!trimmedText) return;

  tasks.unshift(createTask(trimmedText));
  saveTasks();
  render();
}

function toggleComplete(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;

  task.completed = !task.completed;
  task.completedAt = task.completed ? new Date().toISOString() : null;
  saveTasks();
  render();
}

function startEditing(id) {
  editingId = id;
  render();
  requestAnimationFrame(() => {
    const input = document.querySelector('.task-item.editing .edit-input');
    if (input) {
      input.focus();
      input.select();
    }
  });
}

function saveEditing(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;

  const input = document.querySelector('.task-item.editing .edit-input');
  const updatedText = input ? input.value.trim() : '';

  if (updatedText) {
    task.text = updatedText;
    saveTasks();
  }

  editingId = null;
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  if (editingId === id) editingId = null;
  saveTasks();
  render();
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTask(taskInput.value);
  taskInput.value = '';
  taskInput.focus();
});

document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const taskId = button.dataset.id;
  if (!taskId) return;

  if (button.classList.contains('edit-btn')) {
    startEditing(taskId);
  } else if (button.classList.contains('save-btn')) {
    saveEditing(taskId);
  } else if (button.classList.contains('cancel-btn')) {
    editingId = null;
    render();
  } else if (button.classList.contains('delete-btn')) {
    deleteTask(taskId);
  }
});

document.addEventListener('change', (event) => {
  if (event.target.classList.contains('task-toggle')) {
    toggleComplete(event.target.dataset.id);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && editingId) {
    editingId = null;
    render();
  }
});

document.addEventListener('keydown', (event) => {
  const editInput = event.target.closest('.edit-input');
  if (!editInput) return;

  if (event.key === 'Enter') {
    event.preventDefault();
    saveEditing(editInput.dataset.id);
  }
});

render();
