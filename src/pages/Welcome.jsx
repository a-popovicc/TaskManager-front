import { useNavigate } from "react-router-dom";

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Welcome</h1>

                <p style={styles.subtitle}>
                    Organize your tasks, stay productive, and take control of your day
                    with your personal task manager.
                </p>

                <div style={styles.buttonContainer}>
                    <button
                        style={styles.loginBtn}
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                    <button
                        style={styles.signupBtn}
                        onClick={() => navigate("/register")}
                    >
                        Sign up
                    </button>
                </div>
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
        textAlign: "center",
        color: "white",
        maxWidth: "600px",
        padding: "40px",
    },

    title: {
        fontSize: "clamp(2.5rem, 6vw, 4rem)",
        marginBottom: "30px",
    },

    subtitle: {
        fontSize: "clamp(1rem, 1.8vw, 1.3rem)",
        opacity: 0.85,
        lineHeight: "1.6",
        marginBottom: "40px",
    },

    buttonContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "20px",
    },

    loginBtn: {
        padding: "12px 28px",
        fontSize: "1rem",
        borderRadius: "8px",
        border: "2px solid white",
        backgroundColor: "transparent",
        color: "white",
        cursor: "pointer",
    },

    signupBtn: {
        padding: "12px 28px",
        fontSize: "1rem",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "white",
        color: "#203a43",
        fontWeight: "bold",
        cursor: "pointer",
    },
};