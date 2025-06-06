import React from 'react';
export default function TableRow({tableRow, edit, onEditClick, tableName, role}) {
    const isAdmin = role === 'admin';
    const isEdit = edit === 'edit';
    function showEditComponent() {
        onEditClick(tableRow);
    }

    async function deleteRow(rowId) {
        try {
            const response = await fetch('api/delete_row.php', {
                method: "POST",
                body: JSON.stringify({
                    id: rowId,
                    tableName: tableName,
                }),
            })
            if(!response.ok) {
                throw new Error("Problem z połączeniem z api.")
            }
            const data = await response.json();
            const success = data.success;
            if(success) {
                console.log(data.message);
                window.location.reload();
            }

        } catch(error) {
            console.error(error)
        }
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
                    {isAdmin &&
                    <button
                        className="delete-button"
                        onClick={() => deleteRow(tableRow['id'])}
                    >
                        Usuń
                    </button>
                    }
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