import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async () => {
        setErrorMessage("");

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Login failed");
                return;
            }

            const data = await response.json();

            // čuvamo token (kasnije koristiš za auth)
            localStorage.setItem("token", data.token);

            // redirect na budući dashboard
            navigate("/profile");

        } catch (error) {
            setErrorMessage("Server error. Try again later.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Login</h1>

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

                <div style={styles.errorBox}>
                    {errorMessage}
                </div>

                <button style={styles.button} onClick={handleLogin}>
                    Sign in
                </button>

                <p style={styles.text}>
                    Don't have an account?{" "}
                    <span
                        style={styles.link}
                        onClick={() => navigate("/register")}
                    >
            Sign up
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
        width: "320px",
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