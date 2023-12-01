import React, { useRef, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  getDoc,
  query,
  where,
  deleteDoc,
  orderBy,
  limit,
  addDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Firebase/Firebase";
import { useEffect } from "react";
import Logo from "../assets/plouzane-1758197_1920.jpg"

function Chatroom() {
  const nav = useNavigate();
  const auth = getAuth();
  const [user, setUser] = useState([])
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const containerRef = useRef(null);

  useEffect(() => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        nav("/");
      }
    });
  }, []);

  const getData = () => {
    const docRef = query(collection(db, "Chats"), orderBy("date", "asc"));
  
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMessages(data);
    });
  
    return unsubscribe;
  };
  
  useEffect(() => {
    const unsubscribe = getData();
  
    return () => {
      unsubscribe();
    };
  }, []);
  
  const logOutButton = async (e) => {
    e.preventDefault();
    await signOut(auth).then(() => {
      nav("/");
    }).catch((error) => {
      console.log(error)
    });
  }

  const uploadFunc = async (e) => {
    e.preventDefault();
    try {
      const dbRef = collection(db, "Chats");
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const date = currentDate.getDate();
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes().toString().padStart(2, "0");
      const seconds = currentDate.getSeconds();
      const amOrPm = hours >= 12 ? "PM" : "AM";
      const newHours = hours % 12 || 12;
      const newDate = `${date}-${month}-${year} & ${newHours}:${minutes}:${seconds} ${amOrPm}`;
      let Data = {
        message: message,
        uid: user?.uid,
        name: user?.displayName,
        photo: user?.photoURL,
        createdDate: newDate,
        date: new Date(),
      };
      await addDoc(dbRef, Data);
      toast.success("Sent Successfully");
      setMessage("");
      getData();
      inputReference.current.focus();
    } catch (error) {
      toast.error("Please Try Again Later...");
      console.log(error);
    }
  }

  return (
    <>
      <div className="w-full bg-yellow-500 bg-cover bg-center h-screen" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${Logo})`, backgroundBlendMode: 'multiply' }}>
        <div className="flex justify-center items-center">
          <div className={`flex flex-col w-full lg:w-1/2 bg-cover bg-center h-screen`} style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${Logo})`, backgroundBlendMode: 'multiply' }}>
            <div className="flex justify-between gap-2">
              <div className="flex p-2 px-2 gap-2">
                <h2 className="tracking-wide text-center font-bold underline text-white flex-grow">
                  WELCOME TO MY CHAT ROOM
                </h2>
                <div className="">
                  <button
                    className="px-2 bg-[#B5E2F4] text-[#00355f] rounded-lg font-bold"
                    type="button"
                    onClick={logOutButton}
                  >
                    LOGOUT
                  </button>
                </div>
              </div>
              <div className="flex gap-2 px-2">
                <p className="mt-2 tracking-wide text-center font-bold underline text-white">
                  {user?.displayName}
                </p>
                <img src={user?.photoURL} className="w-12 h-12 rounded-full p-1" />
              </div>
            </div>
            <div className="px-2 pb-16 h-auto overflow-y-scroll" ref={containerRef}>
              {messages?.map((data, i) => {
                return (
                  <div
                    className={`flex flex-col ${data?.uid === user?.uid
                      ? "items-end"
                      : "items-start"
                      } mt-2`}
                    key={i}
                  >
                    <div
                      className={`flex gap-2 rounded-lg p-3 ${data?.uid === user?.uid
                        ? "bg-[#00355f] border-2 border-white rounded-l-3xl rounded-br-3xl"
                        : "bg-white  border-2 border-[#00355f] rounded-r-3xl rounded-bl-3xl"
                        }`}
                    >
                      <div>
                        <p
                          className={`text-sm font-bold ${data?.uid === user?.uid
                            ? "text-white"
                            : "text-[#00355f]"
                            }`}
                        >
                          {data.message}
                        </p>
                        <div className="flex flex-col">
                          <span
                            className={`text-xs font-bold ${data?.uid === user?.uid
                              ? "text-white"
                              : "text-[#00355f]"
                              }`}
                          >
                            {data.createdDate}
                          </span>
                          <span
                            className={`text-xs font-bold ${data?.uid === user?.uid
                              ? "text-white"
                              : "text-[#00355f]"
                              }`}
                          >
                            {data?.name}
                          </span>
                        </div>
                      </div>
                      <div className="">
                        <img src={data?.photo} className="w-12 h-12 rounded-full p-1" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center items-center gap-2">
              <form className="flex flex-col lg:flex-row gap-2 m-2 w-auto lg:w-[740px] fixed bottom-0" onSubmit={uploadFunc}>
                <input
                  type="text"
                  className="w-full p-2 text-[#00355f] rounded-lg border-2 border-white outline-white"
                  placeholder="Type to chat"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                <button
                  className="p-2 bg-[#00355f] text-white rounded-lg font-bold"
                  type="submit"
                >
                  SEND
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chatroom;
