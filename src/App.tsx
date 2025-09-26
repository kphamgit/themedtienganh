import {  useState, lazy, Suspense } from "react";
//import { ThemeContext } from "./contexts/theme_context";
//import { ThemeContextInterface } from "./types";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import { Home } from "./components/navigation/Home";
import { Login } from "./auth/Login";
import { Logout } from "./auth/Logout";
import SocketContextComponent from "./contexts/socket_context/Component";
import HomePage from "./components/navigation/HomePage";
import Games from "./components/navigation/Games";

import { useAppDispatch } from "./redux/store"

import { setRootPath } from "./redux/rootpath";

import { LiveQuestionNumberProvider } from "./contexts/livequiz/LiveQuestionNumber";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import TakeQuiz from "./components/quiz_attempts/TakeQuiz";
import TakeVideoQuiz from "./components/quiz_attempts/TakeVideoQuiz";

const Home = lazy(() => import("./components/navigation/Home"))
const SubCategoryPageStudent = lazy(() => import("./components/navigation/SubCategoryStudent"))
const SimplePeer = lazy(() => import('./components/shared/SimplePeer'))
const TtSpeechProvider = lazy(() => import("./contexts/azure/AzureTtsContext"))
const LiveMemoryGame = lazy(() => import("./components/live/LiveMemoryGame"))//
const LivePicture = lazy(() => import("./components/live/LivePicture"))//
const LiveQuiz = lazy(() => import("./components/live/LiveQuiz"))////

const LiveText = lazy(() => import("./components/live/LiveText"))////


 const queryClient = new QueryClient()


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
    
    let rootpath = ''
    if (process.env.NODE_ENV === "production") {
      rootpath = 'https://kphamenglish-f26e8b4d6e4b.herokuapp.com'
      //rootpath = 'https://www.tienganhtuyhoa.com'
    }
    else if (process.env.NODE_ENV === "development") {
      rootpath = 'http://localhost:5001'

    }
    else {
      console.log("invalid NODE_ENV ")
    }
    const dispatch = useAppDispatch();
    dispatch(setRootPath({value: rootpath}))

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

    // <Route path="sub_categories/:sub_category_name/quizzes/:quizId" element={<QuizPageVideo />} />
  return (
    <>
      <SocketContextComponent>
        <Suspense fallback={<div>Loading...</div>}>
          <TtSpeechProvider>
            <LiveQuestionNumberProvider>
            <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Routes>
                <Route path="/logout" element={<Logout onLogout={onLogout} />} />
                <Route path="/" element={<Home />}>
                  <Route path="/homepage/:role" element={<HomePage />} />
                  <Route path="/games" element={<Games />} />
                  <Route path="sub_categories_student/:sub_categoryId" element={<SubCategoryPageStudent />} />
                 
                  <Route path="sub_categories/:sub_category_name/take_quiz/:quizId" element={<TakeQuiz />} />
                  <Route path="sub_categories/:sub_category_name/take_video_quiz/:quizId" element={<TakeVideoQuiz />} />
                  <Route path="/live_text" element={<LiveText />} />
                  <Route path="/simple_peer" element={<SimplePeer />} />
                  <Route path="/live_quiz" element={<LiveQuiz />} >
                      <Route path="live_picture" element={<LivePicture />} />
                  </Route>
                  <Route path="/live_game/:game_id/:backcolor" element={<LiveMemoryGame />} />
                
                 
                </Route>
              </Routes>
            </BrowserRouter>
            </QueryClientProvider>
            </LiveQuestionNumberProvider>
          </TtSpeechProvider>
        </Suspense>
      </SocketContextComponent>
    </>
  );
  
}

// <Route path="/room/:roomID" element={<Room />} />
export default App;