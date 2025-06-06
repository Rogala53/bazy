import React, { useState } from 'react';
export default function InsertForm({ keys, isVisible, onClose, onSave }) {
    const [formData, setFormData] = useState({});
    // Ensure keys is always an array
    const keysArray = Array.isArray(keys) ? keys : (typeof keys === 'string' ? [keys] : []);
    const keysArrayFiltered = keysArray.slice(1);

    const handleInputChange = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleSubmit = () => {
        onSave(formData);
        setFormData({}); // Reset form
        onClose();
    };

    const handleCancel = () => {
        setFormData({}); // Reset form
        onClose();
    };

    function renderFormInput(fieldName, index) {
        const currentValue = formData[fieldName] || '';

        if (fieldName === 'odbior') {
            return (
                <div key={`${fieldName}-${index}`} style={styles.inputGroup}>
                    <label style={styles.label}>{fieldName}</label>
                    <select
                        value={currentValue || 'nie'}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                        style={styles.input}>
                        <option value="nie">Nie</option>
                        <option value="tak">Tak</option>
                    </select>
                </div>
            );
        } else if (fieldName === 'status') {
            return (
                <div key={`${fieldName}-${index}`} style={styles.inputGroup}>
                    <label style={styles.label}>{fieldName}</label>
                    <select
                        value={currentValue || 'przyjete'}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                        style={styles.input}>
                        <option value="przyjete">przyjęte</option>
                        <option value="w_trakcie">W trakcie</option>
                        <option value="zakonczony">Zakończony</option>
                    </select>
                </div>
            );
        } else if (fieldName.startsWith("data")) {
            // Get current date in YYYY-MM-DD format for date input
            const today = new Date();
            const currentDate = today.toISOString().split('T')[0];

            return (
                <div key={`${fieldName}-${index}`} style={styles.inputGroup}>
                    <label style={styles.label}>{fieldName}</label>
                    <input
                        type="date"
                        value={currentValue || currentDate}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                        style={styles.input}
                    />
                </div>
            );
        } else if (fieldName.startsWith("id")) {
            return (
                <div key={`${fieldName}-${index}`} style={styles.inputGroup}>
                    <label style={styles.label}>{fieldName}</label>
                    <input
                        type="number"
                        min="1"
                        value={currentValue}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                        style={styles.input}
                    />
                </div>
            );
        } else {
            // Default text input for other fields
            return (
                <div key={`${fieldName}-${index}`} style={styles.inputGroup}>
                    <label style={styles.label}>{fieldName}</label>
                    <input
                        type="text"
                        value={currentValue}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                        style={styles.input}
                    />
                </div>
            );
        }
    }

    if (!isVisible) return null;

    return (
        <div style={styles.editFormOverlay} onClick={handleCancel}>
            <div style={styles.editFormContent} onClick={(e) => e.stopPropagation()}>
                <h3 style={styles.editFormTitle}>Dodaj wiersz</h3>
                <div style={styles.formContainer}>
                    {keysArrayFiltered.length > 0 ? keysArrayFiltered.map((fieldName, index) => {
                        return renderFormInput(fieldName, index);
                    }) : (
                        <div>No fields to display. Keys: {JSON.stringify(keys)}</div>
                    )}
                </div>
                <div style={styles.buttonContainer}>
                    <button
                        type="button"
                        style={styles.saveButton}
                        onClick={handleSubmit}
                    >
                        Dodaj
                    </button>
                    <button
                        type="button"
                        style={styles.cancelButton}
                        onClick={handleCancel}
                    >
                        Anuluj
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    editFormOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
};