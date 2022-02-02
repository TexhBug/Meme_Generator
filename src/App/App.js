import Memes from "../Memes/Memes";
import { Route, Routes } from "react-router-dom";


const App = () => {

  return (
    <Routes>
      <Route exact path = "/" element = {<Memes/>} />
    </Routes>
  );
}

export default App;
