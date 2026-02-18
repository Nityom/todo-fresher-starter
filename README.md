# Take-Home: Todo List (Vanilla JS)

**Goal**: Build a todo app with **1-level nested drag & drop**, filters, and persistence — **no frameworks, no libraries**.


## live demo: [https://todo-fresher-starter-phi.vercel.app/](https://todo-fresher-starter-phi.vercel.app/)

---

# 📝 Todo App

A responsive, single-page **Nested Todo App** built with vanilla JavaScript, featuring **1-level nesting**, **drag & drop**, **filters**, and **persistent storage**.

---

## 🎯 Overview

This project allows users to manage tasks and subtasks in an intuitive interface.  
You can add todos, nest subtasks, reorder items with drag-and-drop, and filter by completion status.  
All data is saved in **localStorage** for persistence between sessions.

---

### 🧰 Tech Stack

-   HTML
-   CSS
-   JavaScript (Vanilla)

## 🚀 Core Requirements (Must-Have)

### 1. Add Todos

-   Add **top-level todos** by typing into an input and pressing **Enter**.
-   Each todo has a button or icon to **add a sub-task** beneath it.
-   Sub-tasks are displayed visually indented below their parent.
    Example

```
-   Buy groceries
    -   Buy milk
    -   Buy eggs
-   Read a book
    -   Chapter 1: Introduction
```

---

### 2. Drag & Drop (1-Level Nested)

Uses the **HTML5 Drag API** (`draggable`, `dragstart`, `dragover`, `drop`) to reorder tasks.

-   **Drag parent task:** Moves along with all its sub-tasks.
-   **Drag sub-task:** Can be dropped under a different parent or promoted to top-level.
-   **Visual indent:** Sub-tasks appear slightly indented for clarity.

---

### 3. Mark Complete / Delete

-   Each todo has a **checkbox** to mark completion.
-   Completed tasks are shown with a **strikethrough**.
-   A **delete icon** removes a task (and its sub-tasks, if any).

---

### 4. Filter Tabs

Toggle between task views:

-   **All**
-   **Active**
-   **Completed**

When filters are selected, the **URL hash** updates automatically:

-   `#all` → Show all tasks
-   `#active` → Show uncompleted tasks
-   `#completed` → Show completed tasks

---

### 5. Persistence (Local Storage)

-   Todos are **saved to localStorage** on every change.
-   On refresh, data is automatically reloaded.

---

### 6. Responsive Design

-   Works on both **desktop and mobile**.
-   Touch drag-and-drop is optional but considered a bonus.

---

## 📦 Deliverables

-   **Live Demo:** Hosted on [Vercel](https://vercel.com) / [Netlify](https://www.netlify.com) / [Github Pages](https://github.com)
-   **GitHub Repository:** With clean, descriptive commit messages and organized code.

---

## 💭 Reflections

### 🎯 Features Implemented

#### Core Features
- ✅ Add todos with Enter key or "Add" button
- ✅ 1-level nested subtasks with custom inline input (no default popup)
- ✅ Full drag & drop functionality for both parent tasks and subtasks
- ✅ Mark complete/incomplete with visual feedback
- ✅ Delete tasks and subtasks
- ✅ Filter tabs (All, Active, Completed) with URL hash sync
- ✅ LocalStorage persistence
- ✅ Fully responsive design (mobile and desktop)

#### Enhanced Features
- ✅ **Custom subtask input**: Replaced browser's default `prompt()` with a beautiful inline input field that appears directly in the task list
- ✅ **Add button**: Visual "Add" button alongside Enter key for better UX
- ✅ **Smooth animations**: Fade-in effects and hover states for better interactivity
- ✅ **Proper mobile support**: Touch-friendly buttons and responsive layouts

---

### 🚧 Challenges Faced

#### 1. **Drag & Drop Complexity**
**Challenge:** Implementing drag & drop with 1-level nesting was tricky. The main issues were:
- Properly tracking whether a parent or subtask was being dragged
- Calculating correct insertion positions when reordering within the same parent
- Preserving parent task subtasks when reordering
- Handling edge cases (dragging subtask to become a parent, dragging parent to become subtask)

**Solution:** 
- Used `data-parent-index` and `data-sub-index` attributes to track item positions
- Implemented careful index adjustment logic when removing and inserting items
- Created separate handling for different drop scenarios (parent to parent, subtask to subtask, cross-conversions)
- Added safeguards to prevent infinite nesting (subtasks can't have subtasks)

#### 2. **Custom Subtask Input UI**
**Challenge:** The default `prompt()` dialog was not user-friendly and didn't match the app's design.

**Solution:**
- Built a custom inline input field that appears directly below the parent task
- Added "Add" and "Cancel" buttons with proper styling
- Implemented keyboard shortcuts (Enter to add, Escape to cancel)
- Auto-focus on input for immediate typing
- Automatic removal of input after adding or canceling

#### 3. **Filter Synchronization**
**Challenge:** Keeping URL hash, active filter button, and displayed items in sync.

**Solution:**
- Created a centralized `applyFilter()` function
- Added `hashchange` event listener to handle browser back/forward buttons
- Updated hash when filter buttons are clicked
- Ensured filters apply to both parent tasks and subtasks correctly

#### 4. **Responsive Design**
**Challenge:** Making drag & drop work well on mobile while keeping the interface clean.

**Solution:**
- Used flexbox for flexible layouts
- Added comprehensive media queries for mobile screens
- Made buttons touch-friendly with appropriate sizes
- Reduced spacing and font sizes appropriately for smaller screens
- Used `flex-shrink: 0` to prevent button compression

---

### 💡 Suggestions for Improvement

#### **Future Enhancements:**

1. **Multi-level Nesting**
   - Current implementation supports only 1-level nesting
   - Could be enhanced to support unlimited nesting levels with recursive rendering
   - Would require more complex drag & drop logic

2. **Edit Task Text**
   - Add ability to edit existing task text inline (double-click to edit)
   - Use contentEditable or inline input field

3. **Due Dates & Priorities**
   - Add due date picker for tasks
   - Priority levels (high, medium, low) with color coding
   - Sort by due date or priority

4. **Keyboard Shortcuts**
   - `Ctrl+A` to add new task
   - `Ctrl+D` to delete selected task
   - Arrow keys for navigation

5. **Bulk Operations**
   - Select multiple tasks with checkboxes
   - Bulk delete, complete, or move operations

6. **Search & Sort**
   - Search functionality to filter tasks by text
   - Sort options (alphabetically, by date created, by completion)

7. **Backend Sync**
   - Replace localStorage with a backend API
   - Enable cross-device synchronization
   - User authentication

8. **Undo/Redo**
   - History stack for undo/redo operations
   - Useful for accidental deletions or moves

9. **Dark Mode**
   - Toggle between light and dark themes
   - Save preference in localStorage

10. **Task Categories/Tags**
    - Add tags or categories to tasks
    - Filter by tags/categories
    - Color-coded labels

---

### 📚 Lessons Learned

1. **Vanilla JS is Powerful**: This project demonstrated that complex features like drag & drop and nested structures can be built without frameworks.

2. **State Management Matters**: Even in vanilla JS, maintaining a single source of truth (the `todos` array) and re-rendering from it made the code more maintainable.

3. **User Experience Details**: Small touches like custom input fields, animations, and keyboard shortcuts significantly improve user experience.

4. **Mobile-First Approach**: Designing with mobile in mind from the start is easier than retrofitting responsive design later.

5. **Edge Cases Are Critical**: Drag & drop had many edge cases that required careful testing and specific handling.

6. **LocalStorage Limits**: For larger applications, localStorage has size limits (~5-10MB). A backend solution would be needed for production.

---

### 🎓 Key Takeaways

- **Code Organization**: Kept functions modular and single-purpose for easier debugging and maintenance
- **Event Delegation**: Used direct event listeners on dynamically created elements
- **Progressive Enhancement**: Started with core functionality, then added enhancements
- **Browser Compatibility**: HTML5 Drag & Drop API works across modern browsers
- **Accessibility**: Added proper focus states and keyboard support

---

## 🛠️ How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Nityom/todo-fresher-starter.git
   cd todo-fresher-starter
   ```

2. Open `index.html` in your browser:
   ```bash
   # Windows
   start index.html
   
   # macOS
   open index.html
   
   # Linux
   xdg-open index.html
   ```

3. Or use a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve
   ```

---
