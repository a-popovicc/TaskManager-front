import { useEffect, useState } from "react";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");

    const token = localStorage.getItem("token");

    // ================= LOAD USER =================
    useEffect(() => {
        fetch("http://localhost:8080/api/user/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setUser(data);
                setTasks(data.tasks || []);
            })
            .catch((err) => console.log(err));
    }, []);

    // ================= SAVE (ADD / EDIT) =================
    const handleSave = async () => {
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
                dueDate: dueDate ? dueDate + "T00:00:00" : null,
            }),
        });

        if (res.ok) {
            setTasks(await res.json());

            setShowModal(false);
            setEditingTask(null);
            setTitle("");
            setDescription("");
            setDueDate("");
        }
    };

    // ================= DELETE =================
    const handleDelete = async (id) => {
        const res = await fetch(`http://localhost:8080/api/tasks/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) setTasks(await res.json());
    };

    // ================= COMPLETE TOGGLE =================
    const handleComplete = async (id) => {
        const res = await fetch(`http://localhost:8080/api/tasks/${id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) setTasks(await res.json());
    };

    // ================= EDIT =================
    const openEdit = (task) => {
        setEditingTask(task);
        setTitle(task.title || "");
        setDescription(task.description || "");
        setDueDate(task.dueDate?.split("T")[0] || "");
        setShowModal(true);
    };

    return (
        <div style={styles.container}>

            {/* LEFT */}
            <div style={styles.left}>
                {user ? (
                    <>
                        <p style={styles.email}>{user.email}</p>
                        <h2 style={styles.name}>
                            {user.firstName} {user.lastName}
                        </h2>
                    </>
                ) : (
                    <p>Loading...</p>
                )}

                <button
                    style={styles.addBtn}
                    onClick={() => {
                        setEditingTask(null);
                        setTitle("");
                        setDescription("");
                        setDueDate("");
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
                    tasks.map((t) => (
                        <div key={t.id} style={styles.card}>

                            {/* LEFT SIDE TASK INFO */}
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: 0 }}>{t.title}</h3>
                                <p style={{ margin: "5px 0", opacity: 0.8 }}>
                                    {t.description}
                                </p>
                                <small style={{ opacity: 0.6 }}>
                                    Due: {t.dueDate}
                                </small>
                            </div>

                            {/* ACTIONS */}
                            <div style={styles.actions}>

                                <div style={{ position: "relative", zIndex: 10 }}>
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log("TOGGLE CLICK:", t.id);
                                            handleComplete(t.id);
                                        }}
                                        title={t.completed ? "Mark as undone" : "Mark as complete"}
                                        style={{
                                            ...styles.toggle,
                                            background: t.completed ? "#4caf50" : "#444",
                                            justifyContent: t.completed ? "flex-end" : "flex-start",
                                            cursor: "pointer",
                                            userSelect: "none",
                                            position: "relative",
                                            zIndex: 20,
                                        }}
                                    >
                                        <div style={styles.toggleCircle} />
                                    </div>
                                </div>

                                <span onClick={() => openEdit(t)} style={{ cursor: "pointer" }}>✏️</span>
                                <span onClick={() => handleDelete(t.id)} style={{ cursor: "pointer" }}>❌</span>
                            </div>

                        </div>
                    ))
                )}
            </div>

            {/* MODAL */}
            {showModal && (
                <div style={styles.modal}>
                    <div style={styles.modalBox}>
                        <h2 style={{ marginBottom: "10px" }}>
                            {editingTask ? "Edit Task" : "Add Task"}
                        </h2>

                        <input
                            style={styles.input}
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <input
                            style={styles.input}
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <input
                            style={styles.input}
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />

                        <button style={styles.primaryBtn} onClick={handleSave}>
                            {editingTask ? "Save Changes" : "Add Task"}
                        </button>

                        <button style={styles.secondaryBtn} onClick={() => setShowModal(false)}>
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
    name: { fontSize: "1.8rem" },

    addBtn: {
        marginTop: "20px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "white",
        color: "#203a43",
        fontSize: "2rem",
        cursor: "pointer",
        border: "none",
    },

    card: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        marginBottom: "15px",
        background: "rgba(255,255,255,0.12)",
        borderRadius: "15px",
        minHeight: "120px",
    },

    actions: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "center",
    },

    toggle: {
        width: "45px",
        height: "22px",
        borderRadius: "50px",
        display: "flex",
        alignItems: "center",
        padding: "2px",
        cursor: "pointer",
        transition: "0.3s",
    },

    toggleCircle: {
        width: "18px",
        height: "18px",
        background: "white",
        borderRadius: "50%",
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
        background: "rgba(255,255,255,0.1)",
        color: "white",
        cursor: "pointer",
    },
};
