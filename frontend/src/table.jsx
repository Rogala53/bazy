import { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import TableRow from './tableRow';
import KeyRow from './keyRow';
import ReturnButton from './returnButton';
import EditForm from './editForm.jsx';
import InsertForm from './InsertForm.jsx';
export default function Table() {
    const {tableName, edit} = useParams();
    const [isView, setIsView] = useState(false);
    const [data, setData] = useState([]);
    const [keys, setKeys] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showEditForm, setShowEditForm] = useState(false);
    const [showInsertForm, setShowInsertForm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [role, setRole] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('api/get_table_data.php', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tableName: tableName,
                        edit: edit
                    }),
                });

                if(!response.ok) {
                    throw new Error(`HTTP error! STATUS: ${response.status}`);
                }
                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.message);
                }
                setIsView(result.isView);
                if (result.data && result.data.length > 0 && Array.isArray(result.data)) {
                    setData(result.data);
                    setKeys(Object.keys(result.data[0]));
                    setMessage(result.message);
                } else {
                    setData([]);
                    setKeys([]);
                }

                const responseRole = await fetch ('api/get_role.php', {
                    method: "GET"
                });

                if(!responseRole.ok) {
                    throw new Error(`HTTP error! Status: ${responseRole.status}`);
                }
                const resultRole = await responseRole.json();
                setRole(resultRole.role);
            } catch(error) {
                console.error("Wystąpił błąd podczas pobierania danych", error);
                setError(error.message);
            }
        }
        if(tableName) {
            fetchData();
        }
    }, [tableName]);

    function handleEditClick(row) {
        setSelectedRow(row);
        setShowEditForm(true);
    }

    function handleModalClose() {
        setShowEditForm(false);
        setSelectedRow(null);
    }
    function handleSave(editedRow) {
        console.log("Tu zapisywanie zmian w bazie", editedRow);
    }

    function handleInsertClick() {
        setShowInsertForm(true);

    }
    async function handleInsertSave(newRow) {
        try {
            const response = await fetch('api/add_row.php', {
                method: "POST",
                body: JSON.stringify({
                    data_to_insert: newRow,
                    table_name: tableName
                })
            })
            if(!response.ok) {
                throw new Error(`${response.message}`);
            }
            const data = await response.json();
            if(data.success) {
                alert("Nowy rekord został dodany");
                window.location.reload();
            } else {
                throw new Error("Nie udało się dodać rekordu:", data.message);
            }
        } catch(error) {
            console.error(error.message)
        }
    }
    function handleInsertModalClose() {
        setShowInsertForm(false)
    }
    return (
        <>
            <title>{tableName}</title>
            {message && <p style={styles.message}>{message}</p>}
            {error && <p style={styles.error}>{error}</p> }
            <ReturnButton />
            <div className="table-container">
                    <h1>{tableName}</h1>
                    {data.length > 0 ? (
                        <>
                    <table>
                        <thead>
                        <tr>
                         {keys.map((key, index) => (
                             <KeyRow key={index} keyData={key} />
                         ))}
                            {edit === 'edit' ? (
                                <th>edycja</th> ) : null
                            }
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((row, index) => (
                            <TableRow
                                key={index}
                                tableRow={row}
                                edit={edit}
                                onEditClick={handleEditClick}
                                tableName={tableName}
                                role={role}
                            />
                        ))}
                        </tbody>
                    </table>
                            {(isView) ? null :
                            <button className="add-button" type="button" onClick={handleInsertClick}>Dodaj</button>}
                        </>
                        ) : (
                            <div>Brak danych do wyświetlenia</div>
                        )}
            </div>
            {(edit && edit === 'edit' && role === 'admin' ) ? (
            <EditForm
                tableRow={selectedRow}
                isVisible={showEditForm}
                onClose={handleModalClose}
                onSave={handleSave}
                tableName={tableName}
            /> ) : null};
            <InsertForm
                keys={keys}
                isVisible={showInsertForm}
                onClose={handleInsertModalClose}
                onSave={handleInsertSave}/>
        </>
    );
}
const styles = {
    error: {
        color: "red",
    },
    message: {
        color: "green",
    }
};
