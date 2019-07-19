import React, { useState } from "react";
import { AUTH_TOKEN } from "../constants";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

function Login(props) {
  const [login, setLogin] = useState({
    isLogin: true, // switch between Login and SignUp
    email: "",
    password: "",
    name: ""
  });

  const confirm = async data => {
    const { token } = login.isLogin ? data.login : data.signup;
    saveUserData(token);
    props.history.push(`/`);
  };

  const saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token);
  };

  const SIGNUP_MUTATION = gql`
    mutation SignupMutation(
      $email: String!
      $password: String!
      $name: String!
    ) {
      signup(email: $email, password: $password, name: $name) {
        token
      }
    }
  `;

  const LOGIN_MUTATION = gql`
    mutation LoginMutation($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
      }
    }
  `;

  return (
    <div>
      <h4 className="mv3">{login.isLogin ? "Login" : "Sign Up"}</h4>
      <div className="flex flex-column">
        {!login.isLogin && (
          <input
            value={login.name}
            onChange={e => setLogin({ ...login, name: e.target.value })}
            type="text"
            placeholder="Your name"
          />
        )}
        <input
          value={login.email}
          onChange={e => setLogin({ ...login, email: e.target.value })}
          type="text"
          placeholder="Your email address"
        />
        <input
          value={login.password}
          onChange={e => setLogin({ ...login, password: e.target.value })}
          type="password"
          placeholder="Choose a safe password"
        />
      </div>
      <div className="flex mt3">
        <Mutation
          mutation={login.isLogin ? LOGIN_MUTATION : SIGNUP_MUTATION}
          variables={{
            email: login.email,
            password: login.password,
            name: login.name
          }}
          onCompleted={data => confirm(data)}
        >
          {mutation => (
            <div className="pointer mr2 button" onClick={mutation}>
              {login.isLogin ? "login" : "create account"}
            </div>
          )}
        </Mutation>
        <div
          className="pointer button"
          onClick={() => setLogin({ ...login, isLogin: !login.isLogin })}
        >
          {login.isLogin
            ? "need to create an account?"
            : "already have an account?"}
        </div>
      </div>
    </div>
  );
}

export default Login;
