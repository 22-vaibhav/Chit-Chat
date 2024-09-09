import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/userSlice";


const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
    userId: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // console.log("location", location.state);

  useEffect(() => {
    if (!location?.state?.name) {
      navigate("/email");
    }
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/password`;

    try {
      const response = await axios({
        method: "post",
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password,
        },
        withCredentials: true,
      });
      // console.log("response", response);

      toast.success(response.data.message);

      if (response.data.success) {
        // console.log(response.data.data._id);
        dispatch(setToken(response?.data?.token));

        dispatch(
          setUser({
            _id: response.data.data._id,
            name: response.data.data.name,
            email: response.data.data.email,
            profile_pic: response.data.data.profile_pic,
          })
        );


        localStorage.setItem("token", response?.data?.token);
        setData({
          password: "",
        });
        navigate("/", {
          state: response.data.data,
        });
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2 flex justify-center items-center flex-col">
          {/* <HiMiniUserCircle size={80} /> */}
          <Avatar
            width={70}
            name={location?.state?.name}
            height={70}
            imageUrl={location?.state?.profile_pic}
          />
          <h2 className="font-semibold text-lg mt-1">
            {location?.state?.name}
          </h2>
        </div>
        {/* <h3>Welcome to Chat App!</h3> */}
        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Password :</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className="bg-primary text-lg  px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
            Login
          </button>
        </form>
        <p className="my-3 text-center">
          {" "}
          <Link
            to={"/forgot-password"}
            className="hover:text-primary font-semibold"
          >
            Forgot Password ?
          </Link>
        </p>{" "}
      </div>
    </div>
  );
};

export default CheckPasswordPage;
