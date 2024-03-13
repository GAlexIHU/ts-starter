import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <div className="mx-auto container">
        <Outlet />
      </div>
    </>
  );
}

export default App;
