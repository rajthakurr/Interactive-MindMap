# 🧠 Interactive Mindmap Visualization

An interactive web-based mindmap application built using **React** and **D3.js** to visualize hierarchical data in an intuitive and dynamic manner. 

This project demonstrates how complex structured information (such as educational content or technical documentation) can be explored visually through real-time interaction.

---

## 📸 Screenshots

### 1. Interactive Mindmap Canvas
The primary interface featuring a force-directed graph where nodes represent data points. Users can pan and zoom to explore the hierarchy.

**Main Interface: Expand All + Fit View**
![Main Interface](https://github.com/user-attachments/assets/YOUR_EXPAND_ALL_FIT_VIEW_LINK)

---

### 2. Documentation Side Panel
When a node is selected, this panel displays detailed information including titles, summaries, and notes, providing deep context for the visual data.

**Adding New Child Node to the Existing One:**
![Adding Node](https://github.com/user-attachments/assets/YOUR_ADDING_NODE_LINK)

**Deleting Existing Node:**
![Deleting Node](https://github.com/user-attachments/assets/YOUR_DELETE_NODE_LINK)

---

### 3. Global Toolbar & Controls
A dedicated control suite for managing the view, including zoom-to-fit, drill-down capabilities, and the interface to dynamically add new child nodes.

**Collapse All:**
![Collapse All](https://github.com/user-attachments/assets/YOUR_COLLAPSE_ALL_LINK)

**Expand All + Fit View:**
![Expand Fit View](https://github.com/user-attachments/assets/YOUR_EXPAND_FIT_VIEW_CONTROL_LINK)

---

## 🚀 Technologies Used

* **React (TypeScript)**
  Used for building reusable UI components and managing application state efficiently.
* **Vite**
  A fast development and build tool that provides instant hot reloading and optimized production builds.
* **D3.js**
  Used for force-directed graph layout, node positioning, zooming, panning, and interactive SVG rendering.
* **CSS3**
  Custom styling for layout, animations, and responsive UI elements.

---

## 📚 Libraries Used & Why

* **d3-force**
  Handles force-directed graph simulations and dynamic node positioning.
* **d3-zoom**
  Enables smooth zoom and pan interactions on the mindmap canvas.
* **d3-selection**
  Used for DOM selection and binding data to SVG elements.
* **React Hooks (useState, useEffect, useRef)**
  For managing state, lifecycle logic, and seamless D3 integration within React.

---

## 🧠 Overall Architecture & Approach

The application follows a **component-based architecture**:

### 🔹 Core Components
* **MindmapCanvas:** Renders the interactive mindmap using SVG and D3 force simulations.
* **SidePanel:** Displays detailed information (title, summary, notes) of the selected node and provides UI controls to add child nodes.
* **Toolbar:** Contains global actions such as zoom controls, expand/collapse, drill-down, and fit-to-view.
* **MindmapApp / App:** Acts as the central controller managing shared state such as:
    * Selected node
    * Collapsed nodes
    * Mindmap data structure

This separation of concerns ensures **scalability**, **maintainability**, and **clean code organization**.

---

## 🔄 Data Flow (From Data to UI)

1. **Initial Data Structure:** The mindmap data is stored as a hierarchical JSON-like structure where each node contains: `id`, `label`, `summary`, `note`, and `children`.
2. **Hierarchy Processing:** The data is converted into a D3 hierarchy using `d3.hierarchy()`.
3. **Force Simulation:** D3’s force simulation calculates positions for nodes and links dynamically.
4. **Rendering:** Nodes and links are rendered as SVG elements. React manages application state while D3 handles layout and interactions.
5. **User Interaction:** Clicking a node selects it and highlights related elements. The SidePanel updates, and users can add/delete nodes or expand/collapse branches to re-render the graph.

---

## ✨ Key Features

* ✅ Interactive force-directed mindmap
* ✅ Zoom, pan, drill-down, and fit-to-view controls
* ✅ Dynamic node creation and deletion via UI
* ✅ Expand/collapse hierarchical nodes
* ✅ Real-time documentation side panel
* ✅ Clean, responsive, and intuitive UI

---

## 📦 Setup & Run Locally

To get this project running on your local machine, follow these steps:

1. **Install dependencies:**
   ```bash
   npm install
   npm run dev
