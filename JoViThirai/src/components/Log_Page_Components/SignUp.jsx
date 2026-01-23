import { useState } from "react";
import signUpStyle from '../../style/SignUp.module.css';
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";

function SignUp({ handleSignupToggle, handleSignupSubmit,Message }) {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        handleSignupSubmit(name, age, email, password);
    };

    return (
        <div className={signUpStyle.container}>
            <h1 style={{ color: '#fff' }}>SignUp Form</h1>
            <form id="SignUp" className={signUpStyle.form} onSubmit={handleSubmit}>
                <div className={signUpStyle.inputBox}>
                    <FaUser className={signUpStyle.icon} />
                    <input
                        className={signUpStyle.inputStyle}
                        type="text"
                        placeholder="Enter Username"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className={signUpStyle.inputBox}>
                    <FaUser className={signUpStyle.icon} />
                    <input
                        className={signUpStyle.inputStyle}
                        type="number"
                        placeholder="Enter Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                    />
                </div>

                <div className={signUpStyle.inputBox}>
                    <MdEmail className={signUpStyle.icon} />
                    <input
                        className={signUpStyle.inputStyle}
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className={signUpStyle.inputBox}>
                    <FaLock className={signUpStyle.icon} />
                    <input
                        className={signUpStyle.inputStyle}
                        type="password"
                        placeholder="Create Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className={signUpStyle.inputBox}>
                    <FaLock className={signUpStyle.icon} />
                    <input
                        className={signUpStyle.inputStyle}
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <div className={signUpStyle.footer}>
                    <button className={signUpStyle.button} type="submit">
                        SignUp
                    </button>
                    <p>
                        Already have an account?{" "}
                        <span
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                                e.preventDefault();
                                handleSignupToggle();
                            }}
                        >
                            SignIn
                        </span>
                    </p>
                    {Message && <p style={{ color: "white" }}>{Message}</p>}
                </div>
            </form>
        </div>
    );
}

export default SignUp;
