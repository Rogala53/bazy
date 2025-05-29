import { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import TableRow from './tableRow';
import KeyRow from './keyRow';
import ReturnButton from './returnButton';
import EditForm from './editForm.jsx';
export default function Table() {
    const {tableName, edit} = useParams();

    const [data, setData] = useState([]);
    const [keys, setKeys] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showEditForm, setShowEditForm] = useState(false);
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
    return (
        <>
            <title>{tableName}</title>
            {message && <p style={styles.message}>{message}</p>}
            {error && <p style={styles.error}>{error}</p> }
            <ReturnButton />
            <div className="table-container">
                    <h1>{tableName}</h1>
                    {data.length > 0 ? (
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
