import React from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  TextField,
} from "@material-ui/core";
import { FormikHelpers, useFormik } from "formik";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useActions, useAppDispatch } from "../../utils/redux-utils";
import { authActions, authSelectors } from "./index";

type FormikErrorType = {
  email?: string;
  password?: string;
  rememberMe?: boolean;
};
type FormikFormType = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export const Login = () => {
  const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn);
  const { login } = useActions(authActions);
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: (values) => {
      const errors: FormikErrorType = {};
      if (!values.email) {
        errors.email = "email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }
      if (!values.password) {
        errors.password = "password is required";
      } else if (values.password.length <= 2) {
        errors.password = "password must be at least 3 letters long";
      }
      return errors;
    },
    onSubmit: async (
      values: FormikFormType,
      formikHelpers: FormikHelpers<FormikFormType>
    ) => {
      const action = await dispatch(login(values));
      if (login.rejected.match(action)) {
        if (action.payload?.fieldsErrors?.length) {
          const error = action.payload?.fieldsErrors[0];
          formikHelpers.setFieldError(error.field, error.error);
        }
      }
    },
  });

  if (isLoggedIn) {
    return <Redirect to={"/"} />;
  }
  return (
    <Grid container justify="center">
      <Grid item xs={4}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered
                <a
                  href={"https://social-network.samuraijs.com/"}
                  target={"_blank"}
                >
                  {" "}
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField
                label="email"
                margin="normal"
                {...formik.getFieldProps("email")}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <div style={{ color: "red" }}>{formik.errors.email}</div>
              ) : null}
              <TextField
                type="password"
                label="password"
                margin="normal"
                {...formik.getFieldProps("password")}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <div style={{ color: "red" }}>{formik.errors.password}</div>
              ) : null}
              <FormControlLabel
                label={"Remember me"}
                control={
                  <Checkbox
                    onChange={formik.handleChange}
                    value={formik.values.rememberMe}
                    name="rememberMe"
                  />
                }
              />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};
