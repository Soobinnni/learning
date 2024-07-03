import ProjectsSideBar from "./components/ProjectsSideBar.jsx";
import NewProject from "./components/NewProject.jsx";
import NoProjectSelected from "./components/NoProjectSelected.jsx";
import { useState } from "react";

function App() {
  const [projectsState, setProjectsState] = useState({
    selectedProjectId: undefined,
    projects: []
  });

  function handleStartAddProject() {
    setProjectsState(preProjectsState => {
      return {
        ...preProjectsState,
        selectedProjectId: null,
      }
    });
  }

  function handleAddProject (projectData) {
    setProjectsState(preProjectsState => {
      const newProject = { ...projectData, id: Math.random() }
      return {
        ...preProjectsState,
        selectedProjectId:undefined,
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

  let content;

  if(projectsState.selectedProjectId===null){
    content = <NewProject 
                onAdd={handleAddProject}
                onCancel={handleCancelAddProject}
              />
  } else if(projectsState.selectedProjectId===undefined) {
    content = <NoProjectSelected onStartAddProject={handleStartAddProject}/>
  }
  return (
    <main className="h-screen my-8 flex gap-8">
      <ProjectsSideBar 
        onStartAddProject={handleStartAddProject}
        projects = {projectsState.projects}
        />
      {content}
    </main>
  );
}

export default App;
