import { useState } from "react";
import useUserData from "../../../data/userData/useUserData";
import { useNavigate } from "react-router-dom";


const useHome = () => {

    const storedEmail = localStorage.getItem('userEmail');
    const { users, error } = useUserData();
    const [slide, setSlide] = useState(false);
    const navigate = useNavigate();

    const findUser = users?.result?.find(f => {
        return f?.email === storedEmail;
    })



    console.log(findUser)
    return { slide, setSlide, users, error, navigate }
};

export default useHome;