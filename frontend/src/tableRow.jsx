import React from 'react';
export default function TableRow({tableRow, edit, onEditClick}) {
    const isEdit = edit === 'edit';
    function showEditComponent() {
        onEditClick(tableRow);
    }

    function deleteRow() {
        // Tutaj możesz dodać logikę usuwania
        console.log('Usuwanie wiersza:', tableRow);
    }


    return (
        <>
            <tr style={styles.row}>
                {Object.values(tableRow).map((cell, cellIndex) => (
                    <td key={cellIndex} style={styles.cell}>{cell === null ? "-" : String(cell)}</td>
                ))}
                {isEdit && (
                <td style={styles.buttonCell}>
                    <button
                        className="edit-button"
                        style={styles.edit}
                        onClick={showEditComponent}
                    >
                        Edytuj
                    </button>
                    <button
                        className="delete-button"
                        onClick={deleteRow}
                    >
                        Usuń
                    </button>
                </td>
                )}
            </tr>


        </>
    );
}
const styles = {
    buttonCell: {
        padding: '8px 12px',
        border: 'none',
        whiteSpace: 'nowrap',
    },
    row: {
        borderBottom: "1px solid #ddd",
        padding: "15px",
    },
    cell: {
        padding: "15px",
        fontSize: "1.12",
        textAlign: "center",
    },
    edit: {
        margin: "0 5px",
    }
};