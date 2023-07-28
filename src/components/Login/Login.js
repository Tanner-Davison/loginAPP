import React, {
	useState,
	useEffect,
	useReducer,
	useContext,
	useRef,
} from "react";
import Input from "../UI/input";
import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";

const emailReducer = (state, action) => {
	if (action.type === "USER_INPUT") {
		return { value: action.val, isValid: action.val.includes("@") };
	}
	if (action.type === "INPUT_BLUR") {
		return { value: state.value, isValid: state.value.includes("@") };
	}
	return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
	if (action.type === "USER_INPUT") {
		return { value: action.val, isValid: action.val.trim().length > 6 };
	}
	if (action.type === "INPUT_BLUR") {
		return { value: state.value, isValid: state.value.trim().length > 6 };
	}
	return { value: "", isValid: false };
};
const Login = (props) => {
	const [formIsValid, setFormIsValid] = useState(false);

	const [emailState, dispatchEmail] = useReducer(emailReducer, {
		value: "",
		isValid: null,
	});
	const [password, dispatchPassword] = useReducer(passwordReducer, {
		value: "",
		isValid: null,
	});
	const authCtx = useContext(AuthContext);

	const { isValid: emailIsValid } = emailState;
	const { isValid: passwordIsValid } = password;

	const emailInputRef = useRef();
	const passwordInputRef = useRef();

	useEffect(() => {
		const identifier = setTimeout(() => {
			console.log("Checking for Validity");
			setFormIsValid(emailIsValid && passwordIsValid);
		}, 500);

		return () => {
			console.log("EFFECT CLEANUP");
			clearTimeout(identifier);
		};
	}, [passwordIsValid, emailIsValid]);

	// useEffect(() => {
	//   const identifier = setTimeout(() => {
	//     console.log('Checking form validity!');
	//     setFormIsValid(
	//       enteredEmail.includes('@') && enteredPassword.trim().length > 6
	//     );
	//   }, 500);

	//   return () => {
	//     console.log('CLEANUP');
	//     clearTimeout(identifier);
	//   };
	// }, [enteredEmail, enteredPassword]);

	const emailChangeHandler = (event) => {
		dispatchEmail({ type: "USER_INPUT", val: event.target.value });

		// setFormIsValid(
		// 	emailState.isValid && password.isValid
		// );
	};

	const passwordChangeHandler = (event) => {
		dispatchPassword({ type: "USER_INPUT", val: event.target.value });

		setFormIsValid(emailState.isValid && password.isValid);
	};

	const validateEmailHandler = () => {
		dispatchEmail({ type: "INPUT_BLUR" });
	};

	const validatePasswordHandler = () => {
		dispatchPassword({ type: "INPUT_BLUR" });
	};

	const submitHandler = (event) => {
		event.preventDefault();
		if (formIsValid) {
			authCtx.onLogin(emailState.value, password.value);
    } else if (!emailIsValid) {
      emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();
		}
	};

	return (
		<Card className={classes.login}>
			<form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
					type='email'
					id='email'
					label='E-Mail'
					isValid={emailIsValid}
					value={emailState.value}
					onChange={emailChangeHandler}
					onBlur={validateEmailHandler}
				/>
        <Input
          ref={passwordInputRef}
					type='password'
					id='password'
					label='Password'
					isValid={passwordIsValid}
					value={password.value}
					onChange={passwordChangeHandler}
					onBlur={validatePasswordHandler}
				/>
				<div className={classes.actions}>
					<Button
						type='submit'
						className={classes.btn}>
						Login
					</Button>
				</div>
			</form>
		</Card>
	);
};

export default Login;
