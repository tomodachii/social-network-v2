import React, { useState } from "react";
import clsx from "clsx";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import omit from "lodash/omit";

import styles from "./auth.module.scss";

import BookChatLogo from "@/assets/logo.png";
import { type ILoginPayload, loginHandler, ICreateUserPayload, createUserHandler } from "@/apis/auth";
import CustomErrorMessage from "@/components/custom-error-message";
import CustomToast, { notify } from "@/components/custom-toast";
import { translationKey } from "@/constants/common";
import useAuthInfo from "@/hooks/auth/auth";
import { allowNumbersOnly, allowNumbersOnlyOnPaste } from "@/utils/common";

type LoginProps = {};

const SignInForm = ({ handleGoToSignUpForm }) => {
  const { control, setValue, handleSubmit } = useFormContext<ILoginPayload>();
  const navigate = useNavigate();
  const { setAccessToken } = useAuthInfo();
  const { t } = useTranslation([translationKey.messageCode]);
  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async (payload: ILoginPayload) => {
      const res = await loginHandler(payload);
      return res.data;
    },
    onSuccess: ({ data, metadata }) => {
      setAccessToken(data.token);
      notify(t("MSG3", { ns: translationKey.messageCode }), "success");
      navigate("/homepage", { replace: true });
    },
    onError: (error) => {
      notify(t("MSG4", { ns: translationKey.messageCode }), "error");
    },
  });

  const handleError = (error) => {};
  return (
    <form
      className="flex flex-col w-full h-full bg-[#FFE536] rounded-2xl p-12 gap-y-[60px]"
      onSubmit={handleSubmit(async (formData: ILoginPayload) => {
        await loginMutation.mutateAsync(formData);
      }, handleError)}
    >
      <div className="font-bold text-3xl">Sign in</div>
      <div className="flex flex-col gap-4 items-center">
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => {
            return (
              <div className="w-full flex flex-col items-center">
                <input
                  className={clsx(styles.input)}
                  placeholder="Email"
                  value={field.value}
                  onChange={(e) => {
                    setValue("email", e.currentTarget.value);
                  }}
                />
                <CustomErrorMessage>{fieldState.error?.message}</CustomErrorMessage>
              </div>
            );
          }}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => {
            return (
              <div className="w-full flex flex-col items-center">
                <input
                  type="password"
                  className={clsx(styles.input, styles["password-input"])}
                  placeholder="Password"
                  value={field.value}
                  onChange={(e) => {
                    setValue("password", e.currentTarget.value);
                  }}
                />
                <CustomErrorMessage>{fieldState.error?.message}</CustomErrorMessage>
              </div>
            );
          }}
        />
        <div className="text-center text-sm font-bold cursor-pointer">Forgot password?</div>
        <button className={styles.button} type="submit">
          Sign in
        </button>
      </div>
      <div className="text-center">
        Don't have an account?{" "}
        <b className="cursor-pointer" onClick={() => handleGoToSignUpForm()}>
          Sign up
        </b>
      </div>
    </form>
  );
};

const SignUpForm = ({ handleGoToSignInForm }) => {
  const { control, setValue, handleSubmit } = useFormContext<ICreateUserPayload>();
  const { t } = useTranslation([translationKey.messageCode]);
  const createUserMutation = useMutation({
    mutationKey: ["create-user"],
    mutationFn: async (payload: ICreateUserPayload) => {
      const res = await createUserHandler(payload);
      return res.data;
    },
    onSuccess: ({ data, metadata }) => {
      notify(t("MSG5", { ns: translationKey.messageCode }), "success");
      handleGoToSignInForm();
    },
    onError: (error) => {
      notify(t("MSG4", { ns: translationKey.messageCode }), "error");
    },
  });
  const handleError = (error) => {};
  return (
    <div
      className="flex flex-col w-full h-full bg-[#fff] rounded-2xl p-12"
      style={{
        boxShadow: "0px 2px 10px 0px rgba(0, 0, 0, 0.05)",
      }}
    >
      <form
        className="flex flex-col w-full h-full gap-4"
        onSubmit={handleSubmit(async (formData) => {
          const payload = omit(formData, ["confirmPassword"]);
          await createUserMutation.mutateAsync(payload);
        }, handleError)}
      >
        <div className="flex gap-4 items-center">
          <FontAwesomeIcon icon={faChevronLeft} className="text-[24px] cursor-pointer" onClick={handleGoToSignInForm} />
          <div className="text-[#141414] text-2xl font-bold">Sign up</div>
        </div>
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => {
            return (
              <div>
                <input
                  type="text"
                  required
                  className={clsx(styles["create-user-input"])}
                  placeholder="Email"
                  value={field.value}
                  onChange={(e) => {
                    setValue("email", e.currentTarget.value);
                  }}
                />
                <CustomErrorMessage>{fieldState.error?.message}</CustomErrorMessage>
              </div>
            );
          }}
        />
        <div className="flex gap-2 items-center">
          <Controller
            control={control}
            name="firstName"
            render={({ field, fieldState }) => {
              return (
                <input
                  type="text"
                  className={clsx(styles["create-user-input"])}
                  placeholder="First name"
                  value={field.value}
                  onChange={(e) => {
                    setValue("firstName", e.currentTarget.value);
                  }}
                  required
                />
              );
            }}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field, fieldState }) => {
              return (
                <div>
                  <input
                    type="text"
                    className={clsx(styles["create-user-input"])}
                    placeholder="Last name"
                    value={field.value}
                    onChange={(e) => {
                      setValue("lastName", e.currentTarget.value);
                    }}
                  />
                  <CustomErrorMessage>{fieldState.error?.message}</CustomErrorMessage>
                </div>
              );
            }}
          />
        </div>
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field, fieldState }) => {
            return (
              <div>
                <input
                  type="number"
                  className={clsx(styles["create-user-input"])}
                  placeholder="Phone number"
                  value={field.value}
                  onChange={(e) => {
                    setValue("phoneNumber", e.currentTarget.value);
                  }}
                  onKeyPress={allowNumbersOnly}
                  onPaste={allowNumbersOnlyOnPaste}
                />
                <CustomErrorMessage>{fieldState.error?.message}</CustomErrorMessage>
              </div>
            );
          }}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => {
            return (
              <div>
                <input
                  type="password"
                  className={clsx(styles["create-user-input"])}
                  placeholder="password"
                  value={field.value}
                  onChange={(e) => {
                    setValue("password", e.currentTarget.value);
                  }}
                />
                <CustomErrorMessage>{fieldState.error?.message}</CustomErrorMessage>
              </div>
            );
          }}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field, fieldState }) => {
            return (
              <div>
                <input
                  type="password"
                  className={clsx(styles["create-user-input"])}
                  placeholder="Confirm password"
                  value={field.value}
                  onChange={(e) => {
                    setValue("confirmPassword", e.currentTarget.value);
                  }}
                />
                <CustomErrorMessage>{fieldState.error?.message}</CustomErrorMessage>
              </div>
            );
          }}
        />
        <Controller
          control={control}
          name="birthDay"
          render={({ field, fieldState }) => {
            return (
              <input
                required
                type="date"
                className={clsx(styles["create-user-input"])}
                value={field.value}
                onChange={(e) => {
                  setValue("birthDay", e.currentTarget.value);
                }}
              />
            );
          }}
        />
        <Controller
          control={control}
          name="gender"
          render={({ field, fieldState }) => {
            return (
              <div className="flex gap-4 items-center">
                <div>Choose gender: </div>
                <div className="flex items-center">
                  <input
                    required
                    type="radio"
                    className={clsx(styles["create-user-radio"])}
                    name="gender"
                    value="female"
                    id="female"
                    onChange={(e) => {
                      setValue("gender", e.currentTarget.value);
                    }}
                  />
                  <label htmlFor="female">Female</label>
                </div>
                <div className="flex items-center">
                  <input
                    required
                    id="male"
                    type="radio"
                    name="gender"
                    className={clsx(styles["create-user-radio"])}
                    value="male"
                    onChange={(e) => {
                      setValue("gender", e.currentTarget.value);
                    }}
                  />
                  <label htmlFor="male">Male</label>
                </div>
              </div>
            );
          }}
        />
        <i className="mx-auto text-center text-sm text-[#141414] w-2/3 mt-4">
          By signing up, you agree to our Terms of Use and Privacy Policy.
        </i>
        <button className={clsx(styles.button, styles["sign-up-button"])} type="submit">
          Sign in
        </button>
        <div className="text-center">
          Already have an account?{" "}
          <b className="cursor-pointer" onClick={handleGoToSignInForm}>
            Log in
          </b>
        </div>
      </form>
    </div>
  );
};

const Auth = (props: LoginProps) => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const { t } = useTranslation(["translation"]);
  const requiredMsg = t("MSG1", { ns: translationKey.messageCode });
  const incorrectFormatMsg = t("MSG2", { ns: translationKey.messageCode });
  const confirmPasswordMsg = t("MSG6", { ns: translationKey.messageCode });
  const loginValidationSchema = yup.object().shape({
    email: yup.string().required(requiredMsg).email(incorrectFormatMsg),
    password: yup.string().required(requiredMsg),
  });
  const loginFormMethods = useForm<ILoginPayload>({
    reValidateMode: "onSubmit",
    resolver: yupResolver(loginValidationSchema),
  });

  const createUserValidationSchema = yup.object().shape({
    email: yup.string().required(requiredMsg).email(incorrectFormatMsg),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    phoneNumber: yup.string().required(),
    password: yup.string().required(),
    confirmPassword: yup
      .string()
      .required()
      .test({
        message: confirmPasswordMsg,
        test(value, ctx) {
          if (!!value && value !== ctx.parent.password) {
            return false;
          }
          return true;
        },
      }),
    birthDay: yup.date().required(),
    gender: yup.string().required(),
  });
  const registerFormMethods = useForm<ICreateUserPayload>({
    reValidateMode: "onSubmit",
    resolver: yupResolver(createUserValidationSchema),
  });
  return (
    <div className="bg-[#f9f9f9] h-screen w-screen flex items-center justify-center">
      <div className="w-3/4 h-3/4 flex">
        <div className="flex flex-col w-1/2 justify-center items-center gap-6">
          <img src={BookChatLogo} alt="BookChatLogo" className="w-1/2" />
          <div className="flex flex-col gap-4 px-8 w-3/4">
            <div className="text-[#141414] font-bold text-2xl">Last logged in</div>
            <div className="grid grid-cols-3 gap-4">
              <div
                className="rounded-b-2xl cursor-pointer"
                style={{ boxShadow: "0px 2px 10px 0px rgba(0, 0, 0, 0.05)" }}
              >
                <div className="h-[144px] bg-black rounded-t-2xl"></div>
                <div className="w-full text-base font-bold px-4 py-3">User</div>
              </div>
              <div
                className="rounded-b-2xl cursor-pointer"
                style={{ boxShadow: "0px 2px 10px 0px rgba(0, 0, 0, 0.05)" }}
              >
                <div className="h-[144px] bg-black rounded-t-2xl"></div>
                <div className="w-full text-base font-bold px-4 py-3">User</div>
              </div>
              <div
                className="rounded-b-2xl cursor-pointer"
                style={{ boxShadow: "0px 2px 10px 0px rgba(0, 0, 0, 0.05)" }}
              >
                <div className="h-[144px] bg-black rounded-t-2xl"></div>
                <div className="w-full text-base font-bold px-4 py-3">User</div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 h-full">
          {isSignInForm ? (
            <FormProvider {...loginFormMethods}>
              <SignInForm handleGoToSignUpForm={() => setIsSignInForm(false)} />
            </FormProvider>
          ) : (
            <FormProvider {...registerFormMethods}>
              <SignUpForm handleGoToSignInForm={() => setIsSignInForm(true)} />
            </FormProvider>
          )}
        </div>
      </div>
      <CustomToast />
    </div>
  );
};

export default Auth;
