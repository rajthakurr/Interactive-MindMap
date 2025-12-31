# Interactive Mindmap Visualization

An interactive web-based mindmap application built using **React** and **D3.js** to visualize hierarchical data in an intuitive and dynamic manner. 

This project demonstrates how complex structured information (such as educational content or technical documentation) can be explored visually through real-time interaction.

---

## 📸 Screenshots

### 1. Interactive Mindmap Canvas
The primary interface featuring a force-directed graph where nodes represent data points. Users can pan and zoom to explore the hierarchy.

**Main Interface: Expand All + Fit View**
<img width="1918" height="1017" alt="Expand_All + Fit View" src="https://github.com/user-attachments/assets/3a7fa9a5-1290-4b35-9b0e-4e960c0eeed7" />


---

### 2. Documentation Side Panel
When a node is selected, this panel displays detailed information including titles, summaries, and notes, providing deep context for the visual data.

**Adding New Child Node to the Existing One:**
<img width="1918" height="1022" alt="Adding New Child Node to the Existing one" src="https://github.com/user-attachments/assets/70433678-e05c-4f8c-8a9b-eb4361b733f7" />


**Deleting Existing Node:**
<img width="1919" height="1020" alt="Delete Existing Node" src="https://github.com/user-attachments/assets/0ef48fcd-95a9-4a06-9b9d-a6b408a7f49d" />


---

### 3. Global Toolbar & Controls
A dedicated control suite for managing the view, including zoom-to-fit, drill-down capabilities, and the interface to dynamically add new child nodes.

**Collapse All:**
<img width="1918" height="1020" alt="Collapse_All" src="https://github.com/user-attachments/assets/2d383b6f-19e3-4e60-8176-5299da4417ae" />


**Expand All + Fit View:**
<img width="1918" height="1017" alt="Expand_All + Fit View" src="https://github.com/user-attachments/assets/f7674388-5380-4475-a867-85e814d0e205" />


---

## 🚀 Technologies Used

---

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

---

* **d3-force**
    Handles force-directed graph simulations and dynamic node positioning.

* **d3-zoom**
    Enables smooth zoom and pan interactions on the mindmap canvas.

* **d3-selection**
    Used for DOM selection and binding data to SVG elements.

* **React Hooks (`useState`, `useEffect`, `useRef`)**
    For managing state, lifecycle logic, and seamless D3 integration within React.
---

## 🧠 Overall Architecture & Approach

---

The application follows a **component-based architecture**:

### 🔹 Core Components

---

* **MindmapCanvas**
    Renders the interactive mindmap using SVG and D3 force simulations.

* **SidePanel**
    Displays detailed information (title, summary, notes) of the selected node and provides UI controls to add child nodes.

* **Toolbar**
    Contains global actions such as zoom controls, expand/collapse, drill-down, and fit-to-view.

* **MindmapApp / App**
    Acts as the central controller managing shared state such as:
    * Selected node
    * Collapsed nodes
    * Mindmap data structure

---

> This separation of concerns ensures **scalability**, **maintainability**, and **clean code organization**.

---

## 🔄 Data Flow (From Data to UI)

---



1. **Initial Data Structure**
    The mindmap data is stored as a hierarchical JSON-like structure where each node contains: `id`, `label`, `summary`, `note`, and `children`.

2. **Hierarchy Processing**
    The data is converted into a D3 hierarchy using the `d3.hierarchy()` method.

3. **Force Simulation**
    D3’s force simulation calculates $(x, y)$ positions for nodes and links dynamically based on the current state.

4. **Rendering**
    Nodes and links are rendered as SVG elements. React manages the top-level application state while D3 handles the specific layout math and SVG interactions.

5. **User Interaction**
    Clicking a node selects it and highlights related elements. The `SidePanel` updates, and users can add/delete nodes or expand/collapse branches, triggering an automatic re-render of the graph.

---

## ✨ Key Features

* Interactive force-directed mindmap
* Zoom, pan, drill-down, and fit-to-view controls
* Dynamic node creation and deletion via UI
* Expand/collapse hierarchical nodes
* Real-time documentation side panel
* Clean, responsive, and intuitive UI

---

## 📦 Setup & Run Locally

To get this project running on your local machine, follow these steps:

1. **Install dependencies:**
   ```bash
   npm install
   npm run dev






