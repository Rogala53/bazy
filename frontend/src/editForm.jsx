import React, {useState, useEffect} from "react";

export default function EditForm({tableRow, isVisible, onClose, onSave, tableName}) {
    const [editedRow, setEditedRow] = useState(tableRow || {});
    useEffect(() => {
        if(tableRow) {
            const entries = Object.entries(tableRow);
            const filteredEntries = entries.slice(1);
            const filteredRow = Object.fromEntries(filteredEntries);
            setEditedRow(filteredRow);
        }
    }, [tableRow]);

    function renderInputField(key, value) {
        if (key === 'odbior') {
            return (
                <>
                    <div key={key} style={styles.inputGroup}>
                        <label style={styles.label}>{key}</label>
                        <select
                            value={value || ''}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            style={styles.input}>
                            <option value="nie">Nie</option>
                            <option value="tak">Tak</option>
                        </select>
                    </div>
                </>
            )
        }
        else if(key === 'status') {
            return (
                <>
                    <div key={key} style={styles.inputGroup}>
                        <label style={styles.label}>{key}</label>
                        <select
                            value={value || ''}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            style={styles.input}>
                            <option value="przyjete">przyjete</option>
                            <option value="w_trakcie">W trakcie</option>
                            <option value="zakonczony">Zakończony</option>
                        </select>
                    </div>
                </>
            )
        }
        else if(key.startsWith("data")) {
            const date = new Date();
            let day = String(date.getDate()).padStart(2, '0');
            let month = String(date.getMonth() + 1).padStart(2, '0');
            let year = date.getFullYear();

            let currentDate = `${year}.${month}.${day}`;
            return (
                <>
                    <div key={key} style={styles.inputGroup}>
                        <label style={styles.label}>{key}</label>
                        <input
                            type="date"
                            value={(value == null || value == '-') ? currentDate : value}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            style={styles.input}>
                        </input>
                    </div>
                </>
            )
        }
        else if(Number.isInteger(parseInt(value))) {
            return (
            <>
                <div key={key} style={styles.inputGroup}>
                    <label style={styles.label}>{key}</label>
                    <input
                        type="number"
                        min="1"
                        value={value || ''}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        style={styles.input}>
                    </input>
                </div>
            </>
            )
        }
        else {
            return (
                <>
                    <div key={key} style={styles.inputGroup}>
                        <label style={styles.label}>{key}</label>
                        <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            style={styles.input}>
                        </input>
                    </div>
                </>
            )
        }
    }
    function handleInputChange(key, value) {
        setEditedRow(prev => ({
            ...prev,
            [key]: value
        }));
    }

    async function saveChanges() {
        const dataToSave = {
            ...Object.entries(tableRow)[0] && {[Object.keys(tableRow)[0]]: Object.values(tableRow)[0]},
            ...editedRow
        };
        try {
            const response = await fetch('api/edit_row.php', {
                method: "POST",
                body: JSON.stringify({
                    dataToSave: dataToSave,
                    tableName: tableName
                })
            })
            if (!response.ok) {
                throw new Error(`${response.message}`);
            }
            console.log("sukces");
            if (onSave) {
                onSave(dataToSave);
            }
            onClose();
        } catch (error) {
            console.error(error);
        }
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
                        {Object.entries(editedRow).map(([key, value]) =>
                            renderInputField(key, value)
                        )}
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