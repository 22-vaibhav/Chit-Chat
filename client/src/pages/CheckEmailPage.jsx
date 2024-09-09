import React, { useState } from "react";
import { HiMiniUserCircle } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaLongArrowAltRight } from "react-icons/fa";

const CheckEmailPage = () => {

  const [data, setData] = useState({
    email: "",
  });

  const navigate = useNavigate();

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

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/email`;

    try {
      const response = await axios.post(URL, data);
      // console.log("response", response);

      toast.success(response.data.message);

      if (response.data.success) {
        setData({
          email: "",
        });

        navigate("/password", {
          state: response.data.data
        });
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
    // console.log("data ", data);
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2">
          <HiMiniUserCircle
            size={80}
            style={{ fill: "rgb(0 172 180)" }}
            color={"rgb(0 172 180)"}
          />
        </div>
        {/* <h3>Welcome to Chat App!</h3> */}
        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className="bg-primary text-lg  px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
            Next <FaLongArrowAltRight className="inline" />
          </button>
        </form>
        <p className="my-3 text-center">
          New User ?{" "}
          <Link to={"/register"} className="hover:text-primary font-semibold">
            Register
          </Link>
        </p>{" "}
      </div>
    </div>
  );
};

export default CheckEmailPage;
