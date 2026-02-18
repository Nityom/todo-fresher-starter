// -------------------------------------------------
//  Your code starts here – keep it clean & modular
// -------------------------------------------------

const todos = []; // load from localStorage later
const listEl = document.getElementById("todo-list");
const inputEl = document.getElementById("new-todo");
let currentFilter = "all";
let draggedData = null; // Store { parentIndex, subIndex } or { parentIndex }

// Function to render todos
function renderTodos() {
    listEl.innerHTML = ""; // Clear the list

    todos.forEach((todo, index) => {
        const todoEl = document.createElement("li");
        todoEl.className = "todo";
        todoEl.draggable = true;
        todoEl.dataset.parentIndex = index;
        
        if (todo.completed) {
            todoEl.classList.add("completed");
        }

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.addEventListener("change", () => {
            todo.completed = checkbox.checked;
            saveTodos();
            renderTodos();
            applyFilter(currentFilter);
        });
        todoEl.appendChild(checkbox);

        // Text
        const textEl = document.createElement("span");
        textEl.className = "text";
        textEl.textContent = todo.text;
        todoEl.appendChild(textEl);

        // Subtask button
        const subtaskBtn = document.createElement("button");
        subtaskBtn.className = "subtask-btn";
        subtaskBtn.textContent = "+";
        subtaskBtn.title = "Add subtask";
        subtaskBtn.addEventListener("click", () => {
            showSubtaskInput(index, todoEl);
        });
        todoEl.appendChild(subtaskBtn);

        // Delete button
        const deleteBtn = document.createElement("span");
        deleteBtn.className = "delete";
        deleteBtn.textContent = "×";
        deleteBtn.title = "Delete";
        deleteBtn.addEventListener("click", () => {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
            applyFilter(currentFilter);
        });
        todoEl.appendChild(deleteBtn);

        listEl.appendChild(todoEl);

        // Subtasks
        if (todo.subtasks && todo.subtasks.length > 0) {
            todo.subtasks.forEach((subtask, subIndex) => {
                const subtaskEl = document.createElement("li");
                subtaskEl.className = "todo subtask";
                subtaskEl.draggable = true;
                subtaskEl.dataset.parentIndex = index;
                subtaskEl.dataset.subIndex = subIndex;
                
                if (subtask.completed) {
                    subtaskEl.classList.add("completed");
                }

                const subCheckbox = document.createElement("input");
                subCheckbox.type = "checkbox";
                subCheckbox.checked = subtask.completed;
                subCheckbox.addEventListener("change", () => {
                    subtask.completed = subCheckbox.checked;
                    saveTodos();
                    renderTodos();
                    applyFilter(currentFilter);
                });
                subtaskEl.appendChild(subCheckbox);

                const subTextEl = document.createElement("span");
                subTextEl.className = "text";
                subTextEl.textContent = subtask.text;
                subtaskEl.appendChild(subTextEl);

                const subDeleteBtn = document.createElement("span");
                subDeleteBtn.className = "delete";
                subDeleteBtn.textContent = "×";
                subDeleteBtn.title = "Delete";
                subDeleteBtn.addEventListener("click", () => {
                    todo.subtasks.splice(subIndex, 1);
                    saveTodos();
                    renderTodos();
                    applyFilter(currentFilter);
                });
                subtaskEl.appendChild(subDeleteBtn);

                listEl.appendChild(subtaskEl);
            });
        }
    });
    
    setupDragAndDrop();
}

// Function to add a new todo
function addTodo(text) {
    todos.push({ text, completed: false, subtasks: [] });
    saveTodos();
    renderTodos();
    applyFilter(currentFilter);
}

// Function to show inline subtask input
function showSubtaskInput(todoIndex, todoEl) {
    // Remove any existing subtask input
    const existingInput = document.querySelector(".subtask-input-container");
    if (existingInput) {
        existingInput.remove();
    }

    // Create input container
    const inputContainer = document.createElement("li");
    inputContainer.className = "subtask-input-container";

    // Create input field
    const input = document.createElement("input");
    input.type = "text";
    input.className = "subtask-input";
    input.placeholder = "Enter subtask...";

    // Create add button
    const addBtn = document.createElement("button");
    addBtn.className = "subtask-add-btn";
    addBtn.textContent = "Add";
    addBtn.addEventListener("click", () => {
        addSubtask(todoIndex, input.value);
    });

    // Create cancel button
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "subtask-cancel-btn";
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", () => {
        inputContainer.remove();
    });

    // Handle Enter and Escape keys
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && input.value.trim()) {
            addSubtask(todoIndex, input.value);
        }
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            inputContainer.remove();
        }
    });

    // Assemble input container
    inputContainer.appendChild(input);
    inputContainer.appendChild(addBtn);
    inputContainer.appendChild(cancelBtn);

    // Insert after the parent todo
    todoEl.insertAdjacentElement("afterend", inputContainer);
    input.focus();
}

// Function to add a subtask
function addSubtask(todoIndex, text) {
    if (text && text.trim()) {
        todos[todoIndex].subtasks.push({ text: text.trim(), completed: false });
        saveTodos();
        renderTodos();
        applyFilter(currentFilter);
    }
}

// Drag and drop functionality
function setupDragAndDrop() {
    const todoItems = document.querySelectorAll(".todo");
    
    todoItems.forEach(item => {
        item.addEventListener("dragstart", handleDragStart);
        item.addEventListener("dragend", handleDragEnd);
        item.addEventListener("dragover", handleDragOver);
        item.addEventListener("drop", handleDrop);
    });
}

function handleDragStart(e) {
    e.target.classList.add("dragging");
    const parentIndex = parseInt(e.target.dataset.parentIndex);
    const subIndex = e.target.dataset.subIndex;
    
    if (subIndex !== undefined) {
        draggedData = { parentIndex, subIndex: parseInt(subIndex) };
    } else {
        draggedData = { parentIndex };
    }
    e.dataTransfer.effectAllowed = "move";
}

function handleDragEnd(e) {
    e.target.classList.remove("dragging");
    draggedData = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
    const dragging = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(e.currentTarget);
    
    if (afterElement && dragging !== afterElement) {
        e.currentTarget.parentNode.insertBefore(dragging, afterElement);
    }
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const targetParentIndex = parseInt(e.currentTarget.dataset.parentIndex);
    const targetSubIndex = e.currentTarget.dataset.subIndex;
    
    if (!draggedData) return;
    
    // Store dragged item data before removal
    let draggedItem;
    const isDraggingSubtask = draggedData.subIndex !== undefined;
    
    if (isDraggingSubtask) {
        // Dragging a subtask
        draggedItem = { ...todos[draggedData.parentIndex].subtasks[draggedData.subIndex] };
    } else {
        // Dragging a parent task
        draggedItem = { ...todos[draggedData.parentIndex] };
    }
    
    // Determine drop position and handle accordingly
    if (targetSubIndex !== undefined) {
        // Dropping on a subtask - add as sibling in same parent
        let insertIndex = parseInt(targetSubIndex);
        
        // If dragging from same parent's subtasks, adjust index
        if (isDraggingSubtask && draggedData.parentIndex === targetParentIndex) {
            if (draggedData.subIndex < insertIndex) {
                insertIndex--;
            }
            // Remove from old position
            todos[draggedData.parentIndex].subtasks.splice(draggedData.subIndex, 1);
            // Insert at new position
            todos[targetParentIndex].subtasks.splice(insertIndex, 0, {
                text: draggedItem.text,
                completed: draggedItem.completed
            });
        } else {
            // Moving to different parent or from parent to subtask
            // Remove from source
            if (isDraggingSubtask) {
                todos[draggedData.parentIndex].subtasks.splice(draggedData.subIndex, 1);
            } else {
                todos.splice(draggedData.parentIndex, 1);
            }
            // Add to target parent's subtasks
            todos[targetParentIndex].subtasks.splice(insertIndex, 0, {
                text: draggedItem.text,
                completed: draggedItem.completed
            });
        }
    } else if (e.currentTarget.classList.contains("subtask")) {
        // Dropping on subtask area - make it a subtask at the end
        // Remove from source
        if (isDraggingSubtask) {
            todos[draggedData.parentIndex].subtasks.splice(draggedData.subIndex, 1);
        } else {
            todos.splice(draggedData.parentIndex, 1);
        }
        // Add to target parent's subtasks
        todos[targetParentIndex].subtasks.push({
            text: draggedItem.text,
            completed: draggedItem.completed
        });
    } else {
        // Dropping on a parent task - add as top-level todo
        const allTodos = Array.from(document.querySelectorAll(".todo:not(.subtask)"));
        let targetIndex = allTodos.indexOf(e.currentTarget);
        
        // Adjust target index if dragging parent task from before target
        if (!isDraggingSubtask && draggedData.parentIndex < targetIndex) {
            targetIndex--;
        }
        
        // Remove from source
        if (isDraggingSubtask) {
            todos[draggedData.parentIndex].subtasks.splice(draggedData.subIndex, 1);
        } else {
            todos.splice(draggedData.parentIndex, 1);
        }
        
        // Add as top-level todo
        const newTodo = {
            text: draggedItem.text,
            completed: draggedItem.completed,
            subtasks: draggedItem.subtasks || []
        };
        
        if (targetIndex >= 0) {
            todos.splice(targetIndex, 0, newTodo);
        } else {
            todos.push(newTodo);
        }
    }
    
    saveTodos();
    renderTodos();
    applyFilter(currentFilter);
}

function getDragAfterElement(target) {
    return target;
}

// Function to save todos to localStorage
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Function to load todos from localStorage
function loadTodos() {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
        return JSON.parse(savedTodos);
    }
    return [];
}

// Event listener for adding todos
inputEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && inputEl.value.trim() !== "") {
        addTodo(inputEl.value.trim());
        inputEl.value = "";
    }
});

// Filter functionality
const filterButtons = document.querySelectorAll(".filters button");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        const filter = button.getAttribute("data-filter");
        currentFilter = filter;
        window.location.hash = filter;
        applyFilter(filter);
    });
});

function applyFilter(filter) {
    currentFilter = filter;
    const todoItems = document.querySelectorAll("#todo-list > .todo");
    
    todoItems.forEach((item) => {
        const isCompleted = item.querySelector("input[type='checkbox']").checked;
        const parentIndex = item.dataset.parentIndex;
        let shouldShow = true;
        
        if (filter === "active" && isCompleted) {
            shouldShow = false;
        } else if (filter === "completed" && !isCompleted) {
            shouldShow = false;
        }
        
        item.style.display = shouldShow ? "flex" : "none";
        
        // Also handle subtasks
        const subtasks = document.querySelectorAll(`.todo.subtask[data-parent-index="${parentIndex}"]`);
        subtasks.forEach(subtask => {
            const subCompleted = subtask.querySelector("input[type='checkbox']").checked;
            let subShouldShow = shouldShow; // Inherit parent visibility
            
            if (shouldShow) {
                if (filter === "active" && subCompleted) {
                    subShouldShow = false;
                } else if (filter === "completed" && !subCompleted) {
                    subShouldShow = false;
                }
            }
            
            subtask.style.display = subShouldShow ? "flex" : "none";
        });
    });
}

// Handle URL hash on load
function handleHashChange() {
    const hash = window.location.hash.slice(1) || "all";
    const validFilters = ["all", "active", "completed"];
    const filter = validFilters.includes(hash) ? hash : "all";
    
    currentFilter = filter;
    filterButtons.forEach((btn) => {
        btn.classList.remove("active");
        if (btn.getAttribute("data-filter") === filter) {
            btn.classList.add("active");
        }
    });
    
    applyFilter(filter);
}

window.addEventListener("hashchange", handleHashChange);

// Initialize
window.addEventListener("load", () => {
    todos.push(...loadTodos());
    renderTodos();
    handleHashChange();
});
