import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import Main from '../components/Main/main';
import AllHabits from '../components/AllHabits/AllHabits';
import GardenProgress from '../components/GardenProgress/GardenProgress';
import MyGarden from '../components/MyGarden/MyGarden';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Main />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "habits",
        element: <AllHabits />
      },
      {
        path: "garden-progress",
        element: <GardenProgress />
      },
      {
        path: "garden",
        element: <MyGarden />
      }
    ],
  },
]);