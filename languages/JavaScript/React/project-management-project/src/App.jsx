import ProjectsSideBar from "./components/ProjectsSideBar.jsx";
import NewProject from "./components/NewProject.jsx";
import NoProjectSelected from "./components/NoProjectSelected.jsx";
import SelectedProject from "./components/SelectedProject.jsx";

import { useState } from "react";

function App() {
  const [projectsState, setProjectsState] = useState({
    selectedProjectId: undefined,
    projects: [],
    tasks: []
  });

  function handleAddTask(text) {
    setProjectsState(preProjectsState => {
      const taskId = Math.random();
      const newTask = {
        id: taskId,
        text: text,
        projectId: preProjectsState.selectedProjectId
      }
      return {
        ...preProjectsState,
        tasks: [newTask, ...preProjectsState.tasks]
      }
    });
  }

  function handleDeleteTask(id) {
    setProjectsState(preProjectsState => {
      return {
        ...preProjectsState,
        tasks: preProjectsState.tasks.filter(
          (task) => task.id !== id
        )
      }
    });
  }

  function handleSelectedProject(id) {
    setProjectsState(preProjectsState => {
      return {
        ...preProjectsState,
        selectedProjectId: id,
      }
    });
  }

  function handleStartAddProject() {
    setProjectsState(preProjectsState => {
      return {
        ...preProjectsState,
        selectedProjectId: null,
      }
    });
  }

  function handleAddProject(projectData) {
    setProjectsState(preProjectsState => {
      const newProject = { ...projectData, id: Math.random() }
      return {
        ...preProjectsState,
        selectedProjectId: undefined,
        projects: [
          ...preProjectsState.projects,
          newProject
        ]
      }
    });
  }

  function handleCancelAddProject() {
    setProjectsState(preProjectsState => {
      return {
        ...preProjectsState,
        selectedProjectId: undefined // null이면, 프로젝트를 새로 만들겠다는 의미.
      }
    });
  }

  function handleDeleteAddProject() {
    setProjectsState(preProjectsState => {
      return {
        ...preProjectsState,
        selectedProjectId: undefined,
        projects: preProjectsState.projects.filter(
          (project) => project.id !== preProjectsState.selectedProjectId
        )
      }
    });
  }

  const selectedProject = projectsState.projects.find(project => project.id === projectsState.selectedProjectId);
  const selectedProjectTasks = projectsState.tasks.filter((task) => task.projectId === projectsState.selectedProjectId)
  let content = <SelectedProject
    project={selectedProject}
    onDelete={handleDeleteAddProject}
    onAddTask={handleAddTask}
    onDeleteTask={handleDeleteTask}
    tasks={selectedProjectTasks}
  />;

  if (projectsState.selectedProjectId === null) {
    content = <NewProject
      onAdd={handleAddProject}
      onCancel={handleCancelAddProject}
    />
  } else if (projectsState.selectedProjectId === undefined) {
    content = <NoProjectSelected onStartAddProject={handleStartAddProject} />
  }
  return (
    <main className="h-screen my-8 flex gap-8">
      <ProjectsSideBar
        onStartAddProject={handleStartAddProject}
        projects={projectsState.projects}
        onSelectProject={handleSelectedProject}
        selectedProjectId={projectsState.selectedProjectId}
      />
      {content}
    </main>
  );
}

export default App;