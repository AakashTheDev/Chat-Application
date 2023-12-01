import React, { useEffect } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Firebase/Firebase";
import Logo from "../assets/plouzane-1758197_1920.jpg"

function Signin() {
  const nav = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        nav("/Chatroom");
      }
    });
  }, []);

  const signInPopup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user.uid) {
        localStorage.setItem("AuthID", user?.uid);
        localStorage.setItem("Name", user?.displayName);
        localStorage.setItem("Photo", user?.photoURL);
        toast.success("Logged in successfully");
        setTimeout(() => {
          nav("/Chatroom");
        }, 1500);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="w-full bg-yellow-500 bg-cover bg-center h-screen" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${Logo})`, backgroundBlendMode: 'multiply' }}>
        <div className="flex justify-center items-center h-full">
          <div className="flex flex-col w-full lg:w-1/2 bg-white bg-cover bg-center h-screen" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${Logo})`, backgroundBlendMode: 'multiply' }}>
            <h2 className="tracking-wide text-center font-bold underline text-white">
              WELCOME TO MY CHAT ROOM
            </h2>
            <div className="flex justify-center items-center h-[100vh]">
              <button
                onClick={signInPopup}
                className="p-2 bg-[#B5E2F4] font-bold text-[#00355f] rounded-lg"
              >
                SIGNIN WITH GOOGLE
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signin;
