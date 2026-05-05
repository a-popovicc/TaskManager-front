import { useEffect, useState } from "react";

export default function Profile() {

    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState(""); // datetime-local
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    // ================= LOAD USER =================
    useEffect(() => {
        fetch("http://localhost:8080/api/user/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                setUser(data);
                setTasks(data.tasks || []);
            });
    }, []);

    // ================= SAVE =================
    const handleSave = async () => {

        setError("");

        const url = editingTask
            ? `http://localhost:8080/api/tasks/${editingTask.id}`
            : "http://localhost:8080/api/tasks/add";

        const method = editingTask ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title,
                description,
                dueDate: dueDate ? dueDate + ":00" : null, // 🔥 FIX ZA SECONDS
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.message || "Request failed");
            return;
        }

        setTasks(data);

        setShowModal(false);
        setEditingTask(null);
        setTitle("");
        setDescription("");
        setDueDate("");
    };

    // ================= DELETE =================
    const handleDelete = async (id) => {

        const res = await fetch(`http://localhost:8080/api/tasks/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            const data = await res.json();
            setTasks(data);
        }
    };

    // ================= COMPLETE =================
    const handleComplete = async (id) => {

        const res = await fetch(`http://localhost:8080/api/tasks/${id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) return;

        const data = await res.json();
        setTasks(data);
    };

    // ================= EDIT =================
    const openEdit = (task) => {
        setEditingTask(task);
        setTitle(task.title || "");
        setDescription(task.description || "");

        // 🔥 FIX: backend ISO -> datetime-local format
        setDueDate(task.dueDate ? task.dueDate.slice(0, 16) : "");

        setError("");
        setShowModal(true);
    };

    return (
        <div style={styles.container}>

            {/* LEFT */}
            <div style={styles.left}>
                {user ? (
                    <>
                        <p style={styles.email}>{user.email}</p>
                        <h2>{user.firstName} {user.lastName}</h2>
                    </>
                ) : <p>Loading...</p>}

                <button
                    style={styles.addBtn}
                    onClick={() => {
                        setEditingTask(null);
                        setTitle("");
                        setDescription("");
                        setDueDate("");
                        setError("");
                        setShowModal(true);
                    }}
                >
                    +
                </button>
            </div>

            {/* RIGHT */}
            <div style={styles.right}>
                <h2>Your Tasks</h2>

                {tasks.length === 0 ? (
                    <p style={{ opacity: 0.5 }}>No tasks yet...</p>
                ) : (
                    tasks.map(t => (
                        <div
                            key={t.id}
                            style={{
                                ...styles.card,
                                background: t.completed
                                    ? "rgba(76,175,80,0.22)"
                                    : "rgba(255,255,255,0.12)",
                                transition: "all 0.25s ease",
                                transform: t.completed ? "scale(1.01)" : "scale(1)",
                            }}
                        >

                            <div style={{ flex: 1 }}>
                                <h3 style={{
                                    margin: 0,
                                    textDecoration: t.completed ? "line-through" : "none",
                                    opacity: t.completed ? 0.6 : 1
                                }}>
                                    {t.title}
                                </h3>

                                <p style={{ margin: "5px 0" }}>
                                    {t.description}
                                </p>

                                <small style={{ opacity: 0.7 }}>
                                    Due: {t.dueDate}
                                </small>
                            </div>

                            <div style={styles.actions}>

                                <button
                                    style={{
                                        ...styles.completeBtn,
                                        background: t.completed ? "#4caf50" : "#555",
                                    }}
                                    onClick={() => handleComplete(t.id)}
                                >
                                    ✓
                                </button>

                                <button
                                    style={styles.editBtn}
                                    onClick={() => openEdit(t)}
                                >
                                    ✎
                                </button>

                                <button
                                    style={styles.deleteBtn}
                                    onClick={() => handleDelete(t.id)}
                                >
                                    🗑
                                </button>

                            </div>

                        </div>
                    ))
                )}
            </div>

            {/* MODAL */}
            {showModal && (
                <div style={styles.modal}>
                    <div style={styles.modalBox}>

                        <h2>{editingTask ? "Edit Task" : "Add Task"}</h2>

                        {error && (
                            <div style={styles.errorBox}>
                                {error}
                            </div>
                        )}

                        <input
                            style={styles.input}
                            placeholder="Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />

                        <input
                            style={styles.input}
                            placeholder="Description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />

                        {/* 🔥 DATETIME INPUT */}
                        <input
                            type="datetime-local"
                            style={styles.input}
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                        />

                        <button style={styles.primaryBtn} onClick={handleSave}>
                            {editingTask ? "Save Changes" : "Add Task"}
                        </button>

                        <button
                            style={styles.secondaryBtn}
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}

/* ================= STYLES ================= */

const styles = {

    container: {
        display: "flex",
        height: "100vh",
        background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
        color: "white",
        fontFamily: "Arial",
    },

    left: {
        width: "30%",
        padding: "30px",
        borderRight: "1px solid rgba(255,255,255,0.2)",
    },

    right: {
        width: "70%",
        padding: "30px",
        overflowY: "auto",
    },

    email: { opacity: 0.7 },

    addBtn: {
        marginTop: "20px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "white",
        color: "#203a43",
        fontSize: "2rem",
        border: "none",
        cursor: "pointer",
    },

    card: {
        position: "relative",
        padding: "20px",
        marginBottom: "15px",
        borderRadius: "15px",
    },

    actions: {
        position: "absolute",
        top: "10px",
        right: "10px",
        display: "flex",
        gap: "8px",
    },

    completeBtn: {
        border: "none",
        borderRadius: "8px",
        padding: "6px 10px",
        cursor: "pointer",
        color: "white",
        fontWeight: "bold",
    },

    editBtn: {
        border: "none",
        borderRadius: "8px",
        padding: "6px 10px",
        background: "#2196f3",
        color: "white",
        cursor: "pointer",
    },

    deleteBtn: {
        border: "none",
        borderRadius: "8px",
        padding: "6px 10px",
        background: "#f44336",
        color: "white",
        cursor: "pointer",
    },

    modal: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    modalBox: {
        background: "rgb(154,184,197)",
        padding: "25px",
        borderRadius: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "350px",
    },

    errorBox: {
        background: "#ff5252",
        padding: "10px",
        borderRadius: "8px",
        fontWeight: "bold",
    },

    input: {
        padding: "10px",
        borderRadius: "8px",
        border: "none",
        outline: "none",
        background: "rgb(154,184,197)",
        color: "white",
    },

    primaryBtn: {
        padding: "10px",
        borderRadius: "8px",
        border: "none",
        background: "#4caf50",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold",
    },

    secondaryBtn: {
        padding: "10px",
        borderRadius: "8px",
        border: "none",
        background: "rgba(255,255,255,0.2)",
        color: "white",
        cursor: "pointer",
    },
};