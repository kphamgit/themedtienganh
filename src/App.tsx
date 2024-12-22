import {  useEffect, useState, lazy, Suspense } from "react";
//import { ThemeContext } from "./contexts/theme_context";
//import { ThemeContextInterface } from "./types";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import { Home } from "./components/navigation/Home";
import { Login } from "./auth/Login";
import { Logout } from "./auth/Logout";
import SocketContextComponent from "./contexts/socket_context/Component";
import TtSpeechProvider from "./contexts/azure/AzureTtsContext";
import { SubCategoryPageStudent } from "./components/navigation/SubCategoryStudent";
//import { QuizPageVideo } from "./features/quiz_attempt/components/QuizPageVideo";
import CategoryPage from "./components/navigation/CategoryPage";

import { LiveText } from "./components/live/LiveText";
//import { QuizPageLive } from "./pages/QuizPageLive";
import MemoryGame from "./components/live/MemoryGame";
import SimplePeer from "./components/shared/SimplePeer";
import { QuizPageVideo } from "./components/quiz_attempts/QuizPageVideo";
//import SocketContext from "./contexts/socket_context/Context";

const Home = lazy(() => import("./components/navigation/Home"))
/*

//const SubCategory = lazy(() => import("./routes/SubCategory"))
//const SubCategoryPageTeacher = lazy(() => import("./pages/SubCategoryPageTeacher"))
//const QuizPageVideo = lazy(() => import("./pages/QuizPageVideo"))

const QuizPageVideo  = lazy(() => import('./routes/TakeVideoQuiz'));
const YoutubeVideoPlayer = lazy(() => import('./components/YoutubeVideoPlayer'));
const MemoryGame = lazy(() => import('./components/MemoryGame')) 
const SimplePeer = lazy(() => import('./components/SimplePeer'))
const QuizPageLive = lazy(() => import('./routes/TakeQuizLive'))  

const TtSpeechProvider = lazy(() => import("./components/context/AzureTtsContext"))
const AudioBlobProvider = lazy(() => import("./components/context/AudioBlobContext"))

*/


function getAuthFromSessionStorage() {
    const tokenString = sessionStorage.getItem('auth');
    if (tokenString !== null)
      return JSON.parse(tokenString)
    else {
      return null
    }
  }

function App() {
    //const { darkTheme, toggleTheme } = useContext(ThemeContext) as ThemeContextInterface;
    //const {socket, uid, users, user_uuids} = useContext(SocketContext).SocketState;
    const [auth, setAuth] = useState(getAuthFromSessionStorage());

    useEffect(() => {
        /*
        getIds() // fetch ALL game ids, sub_category ids, unit ids, quizzes id
          .then((response) => {
            //console.log("NNNNNNNN response.data", response.data)
            setCategoryIds(response.category_ids)
            setSubCategoryIds(response.sub_category_ids)
            setUnitIds(response.unit_ids)
          })
          */
      }, [auth])
    
      const onLogin = (userToken: string) => {
        setAuth(userToken)
        //also persits auth state in session Storage so that user is still logged after a page refresh
        sessionStorage.setItem('auth', JSON.stringify(userToken));
      }

      if (!auth) {
        return (
        <>
        <Login onLoginSuccess={onLogin} />
   
        </>
        )
      }
    
      const onLogout = () => {
        sessionStorage.clear()
        setAuth(null)
    }

    return (
        <>
     <SocketContextComponent>
      <TtSpeechProvider>
     
            <BrowserRouter>
              <Routes>
                <Route path="/logout" element={<Logout onLogout={onLogout} />} />
                <Route path="/" element={<Home />}>
                  <Route path="/categories/:categoryId" element={<CategoryPage />}>
                    <Route path="sub_categories_student/:sub_categoryId" element={<SubCategoryPageStudent />} />
                    <Route path="sub_categories/:sub_category_name/quizzes/:quizId" element={<QuizPageVideo />} />
                  </Route>
                  <Route path="/live_text" element={<LiveText />} />
                  <Route path="/simple_peer" element={<SimplePeer />} />
                
                  <Route path="/live_game/:game_id/:backcolor" element={<MemoryGame />} />
                </Route>
              </Routes>
            </BrowserRouter>
       
      </TtSpeechProvider>
      </SocketContextComponent>
         </>
  );
  
}

export default App;
/*
return (
        <>
      <div className={`flex h-screen w-screen items-center justify-center bg-bgColor text-textColor`}>
          <div className="rounded-md bg-textColor p-8 text-bgColor">
              <h1 className="text-3xl">Theme {darkTheme ? "dark" : "light"}</h1>
              <button
                  onClick={toggleTheme}
                  className="mt-2 w-full rounded-none bg-bgColor p-2 text-center text-2xl uppercase tracking-[3px] text-textColor transition-all duration-300 ease-in-out hover:rounded-lg"
              >
                  Toggle
              </button>
          </div>
      </div>
           <BrowserRouter>
           <Routes>
          
             <Route path="/" element={<Home />}>
     
             </Route>
           </Routes>
         </BrowserRouter>
         </>
  );
  
*/
/*
 <SocketContextComponent>
      <TtSpeechProvider>
      <PollyProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/logout" element={<Logout onLogout={onLogout} />} />
            <Route path="/" element={<Home />}>
                <Route path="/categories/:categoryId" element={<CategoryPage />}>
                  <Route path="sub_categories_student/:sub_categoryId" element={<SubCategoryPageStudent />} />
                  <Route path="sub_categories_teacher/:sub_categoryId" element={<SubCategoryPageTeacher />} />
                  <Route path="sub_categories/:sub_category_name/quizzes/:quizId" element={<QuizPageVideo />} />
                  <Route path="sub_categories/:sub_category_name/list_questions/:quiz_id" element={<ListQuestions />}/>
                  <Route path="sub_categories/:sub_category_name/list_questions/:quiz_id/edit_question/:question_id" element={<QuestionEditor />} />
                </Route>
                <Route path="/live_text" element={<LiveText />} />
                <Route path="/live_quiz" element={<QuizPageLive />} />
                <Route path="/live_game/:game_id/:backcolor" element={<MemoryGame />} />
  
            </Route>
          </Routes>
        </BrowserRouter>
        </PollyProvider>
      </TtSpeechProvider>
      </SocketContextComponent>
*/