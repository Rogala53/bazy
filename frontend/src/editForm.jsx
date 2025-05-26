import React, {useState, useEffect} from "react";

export default function EditForm({tableRow, isVisible, onClose, onSave}) {
    const [editedRow, setEditedRow] = useState(tableRow || {});

    useEffect(() => {
        if(tableRow) {
            setEditedRow(tableRow);
        }
    }, [tableRow]);
    function handleInputChange(key, value) {
        setEditedRow(prev => ({
            ...prev,
            [key]: value
        }));
    }

    function saveChanges() {
        // Tutaj możesz dodać logikę zapisywania
        console.log('Zapisywanie zmian:', editedRow);
        if(onSave) {
            onSave(editedRow);
        }
        onClose();
    }

    function cancelEdit() {
        setEditedRow(tableRow || {});
        onClose();
    }

    if(!isVisible) return null;
    return (
        <>
            <div style={styles.editFormOverlay} onClick={cancelEdit}>
                <div style={styles.editFormContent} onClick={(e) => e.stopPropagation()}>
                    <h3 style={styles.editFormTitle}>Edytuj wiersz</h3>

                    <div style={styles.formContainer}>
                        {Object.entries(editedRow).map(([key, value]) => (
                            <div key={key} style={styles.inputGroup}>
                                <label style={styles.label}>{key}:</label>
                                <input
                                    type="text"
                                    value={value === null ? '' : String(value)}
                                    onChange={(e) => handleInputChange(key, e.target.value)}
                                    style={styles.input}
                                />
                            </div>
                        ))}
                    </div>

                    <div style={styles.buttonContainer}>
                        <button
                            style={styles.saveButton}
                            onClick={saveChanges}
                        >
                            Zapisz
                        </button>
                        <button
                            style={styles.cancelButton}
                            onClick={cancelEdit}
                        >
                            Anuluj
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

const styles = {
    editFormOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba (0, 0, 0, 0.6)',
        display: "flex",
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '50px',
        zIndex: 1000,
    },
    editFormContent: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        minWidth: '400px',
        maxWidth: '600px',
        maxHeight: 'calc(100vh - 100px)',
        overflow: 'auto',
        border: '1px solid #e0e0e0',
    },
    editFormTitle: {
        margin: '0 0 20px 0',
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    formContainer: {
        marginBottom: '24px',
    },
    inputGroup: {
        marginBottom: '16px',
    },
    label: {
        display: 'block',
        marginBottom: '6px',
        fontWeight: '600',
        color: '#555',
        fontSize: '14px',
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        border: '2px solid #e0e0e0',
        borderRadius: '6px',
        fontSize: '14px',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s ease',
        ':focus': {
            borderColor: '#4CAF50',
            outline: 'none',
        }
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'background-color 0.2s ease',
    },
    cancelButton: {
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'background-color 0.2s ease',
    },
}