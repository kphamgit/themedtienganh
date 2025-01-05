import {  useState, lazy, Suspense } from "react";
//import { ThemeContext } from "./contexts/theme_context";
//import { ThemeContextInterface } from "./types";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import { Home } from "./components/navigation/Home";
import { Login } from "./auth/Login";
import { Logout } from "./auth/Logout";
import SocketContextComponent from "./contexts/socket_context/Component";
//import TakeLiveQuiz from "./components/live/TakeLiveQuiz";
//import { SendLiveText } from "./components/live/SendLiveText";
//import { SendLivePicture } from "./components/live/SendLivePicture";
//import YoutubeVideoPlayer from "./components/shared/YoutubeVideoPlayer";
//import { LiveText } from "./components/live/LiveText";
//import { LivePicture } from "./components/live/LivePicture";

const Home = lazy(() => import("./components/navigation/Home"))
const SubCategoryPageStudent = lazy(() => import("./components/navigation/SubCategoryStudent"))
const SimplePeer = lazy(() => import('./components/shared/SimplePeer'))
const QuizPageVideo  = lazy(() => import('./components/quiz_attempts/QuizPageVideo'));
const TtSpeechProvider = lazy(() => import("./contexts/azure/AzureTtsContext"))
const CategoryPage = lazy(() => import("./components/navigation/CategoryPage"))//
const MemoryGame = lazy(() => import("./components/live/MemoryGame"))//
const LivePicture = lazy(() => import("./components/live/LivePicture"))//
const TakeLiveQuiz = lazy(() => import("./components/live/TakeLiveQuiz"))////
const YoutubeVideoPlayer = lazy(() => import("./components/shared/YoutubeVideoPlayer"))////
const LiveText = lazy(() => import("./components/live/LiveText"))////


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
        <Suspense fallback={<div>Loading...</div>}>
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
                  <Route path="/live_picture" element={<LivePicture />} />
                  <Route path="/simple_peer" element={<SimplePeer />} />
                  <Route path="/live_quiz" element={<TakeLiveQuiz />} />
                  <Route path="/live_game/:game_id/:backcolor" element={<MemoryGame />} />
                  <Route path="/live_youtube_video" element={<YoutubeVideoPlayer />} />
                </Route>
              </Routes>
            </BrowserRouter>

          </TtSpeechProvider>
        </Suspense>
      </SocketContextComponent>
    </>
  );
  
}

// <Route path="/room/:roomID" element={<Room />} />
export default App;
/*

        <Route path="/" exact component={CreateRoom} />
        <Route path="/room/:roomID" component={Room} />
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