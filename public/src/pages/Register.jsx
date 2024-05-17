import React,{useState,useEffect} from 'react'
import styled from 'styled-components';
import {Link,useNavigate} from 'react-router-dom' // To link another route
import Logo from '../assets/logo.svg'
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// toast notifications
import axios from 'axios';
import { registerRoute } from '../utils/APIRoutes';
import SocialLoginButtons from '../components/SocialLoginButtons';

const Register = () => {
  const navigate=useNavigate();
  const [values,setValues]=useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
  });
  
  const toastOptions={
      position: "bottom-right",
      autoClose:8000,
      pauseOnHover:true,
      draggable:true,
      theme:"dark"
    };

    useEffect(()=>{
      if(localStorage.getItem('chat-app-user')){
        navigate("/");
      }
    },[]);
    
    const handleChange=(event)=>{
        setValues({...values, [event.target.name]: event.target.value});
    }
  
    const handleValidation=()=>{
        const {password, confirmPassword, email, username} =values;
        if(password!==confirmPassword){
            toast.error("password and confirm password should be same.",
                toastOptions
            );
            return false;
        }else if(username.length<3){
            toast.error("Username should be greater than 3 characters",toastOptions);
            return false;
        }else if(password.length<8){
            toast.error("Password should be equal or greater than 8 characters",toastOptions);
            return false;
        }else if(email===""){
            toast.error("Email.is required",toastOptions);
            return false;
        }
        return true;
    }

    const handleSubmit = async  (event)=>{
        event.preventDefault();
        // alert("form")
        if(handleValidation()){
            const {password, email, username} =values;
            const {data}=await axios.post(registerRoute,{
                username,
                email,
                password,
            });
            console.log(data);
            if(data.status===false){
              console.log(data);
              toast.error(data.msg,toastOptions);
            }
            if(data.status===true){
              localStorage.setItem("chat-app-user",JSON.stringify(data.user));
              navigate("/");
            }
        }
    };


  return (
    <>
    <FormContainer>
        <form action="" onSubmit={(event)=>handleSubmit(event)}>
            <div className='brand'>
                <img src={Logo} alt='Logo'/>
                <h2>snappy</h2>
            </div>
            <input type="text" name="username" placeholder="Username" onChange={e=>handleChange(e)} />
            <input type="email" name="email" placeholder="Email" onChange={e=>handleChange(e)} />
            <input type="password" name="password" placeholder="Password" onChange={e=>handleChange(e)} />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={e=>handleChange(e)} />

            <button type="submit" className="btn">Create User</button>
            <SocialLoginButtons />
            <span>Already have an account ? <Link to="/login">Login</Link> </span>
        </form>
    </FormContainer>
    <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.6rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    justify-content: center;
    img {
      height: 3.3rem;
    }
    h2 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.4rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 2rem 4.3rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  .btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
export default Register