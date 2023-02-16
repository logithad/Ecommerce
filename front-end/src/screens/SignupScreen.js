import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Store } from "../Store.js";
import { toast } from "react-toastify";

export default function SignupScreen() {
  const navigate = new useNavigate();
  const { search } = useLocation();
  const redirectInURL = new URLSearchParams(search).get("redirect");
  const redirect = redirectInURL ? redirectInURL : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Mismatch Password!");
      return;
    }
    try {
      const { data } = await Axios.post("/api/users/signup", {
        name,
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
      toast.success("Signed up successfull");
    } catch (err) {
      console.log(err);
      toast.error("Invalid email or password");
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title> Sign Up </title>{" "}
      </Helmet>{" "}
      <h1 className="my-3"> Sign Up </h1>{" "}
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label> Name </Form.Label>{" "}
          <Form.Control
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
            required
          />
        </Form.Group>{" "}
        <Form.Group className="mb-3" controlId="email">
          <Form.Label> Email </Form.Label>{" "}
          <Form.Control
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
        </Form.Group>{" "}
        <Form.Group className="mb-3" controlId="password">
          <Form.Label> Password </Form.Label>{" "}
          <Form.Control
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
        </Form.Group>{" "}
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label> Confirm Password </Form.Label>{" "}
          <Form.Control
            type="password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            required
          />
        </Form.Group>{" "}
        <div className="mb-3">
          <Button type="submit"> Sign Up </Button>{" "}
        </div>{" "}
        <div className="mb-3">
          Already have an account
          <Link to={`/signin?redirect=${redirect}`}> Sign - In </Link>{" "}
        </div>{" "}
      </Form>{" "}
    </Container>
  );
}
