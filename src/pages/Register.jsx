import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const handleRegister = async () => {
        setErrorMessage("");

        // basic frontend check
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                    confirmPassword
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Registration failed");
                return;
            }

            // ako uspe → vodi na login
            navigate("/login");

            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setErrorMessage("Server error. Try again later.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Sign Up</h1>

                <input
                    style={styles.input}
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />

                <input
                    style={styles.input}
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />

                <input
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    style={styles.input}
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    style={styles.input}
                    placeholder="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <div style={styles.errorBox}>
                    {errorMessage}
                </div>

                <button style={styles.button} onClick={handleRegister}>
                    Create account
                </button>

                <p style={styles.text}>
                    Already have an account?{" "}
                    <span
                        style={styles.link}
                        onClick={() => navigate("/login")}
                    >
            Login
          </span>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        fontFamily: "Arial, sans-serif",
    },

    card: {
        backgroundColor: "rgba(255,255,255,0.1)",
        padding: "40px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "340px",
        textAlign: "center",
        color: "white",
    },

    title: {
        marginBottom: "10px",
    },

    input: {
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        outline: "none",
    },

    errorBox: {
        minHeight: "20px",
        color: "#ff6b6b",
        fontSize: "0.9rem",
        textAlign: "center",
    },

    button: {
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        backgroundColor: "white",
        fontWeight: "bold",
        marginTop: "5px",
    },

    text: {
        fontSize: "0.9rem",
        opacity: 0.8,
    },

    link: {
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
        textDecoration: "underline",
    },
};