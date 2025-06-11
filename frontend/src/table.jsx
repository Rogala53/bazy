import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TableRow from './tableRow';
import KeyRow from './keyRow';
import ReturnButton from './returnButton';
import EditForm from './editForm.jsx';
import InsertForm from './InsertForm.jsx';

export default function Table() {
    const { tableName, edit } = useParams();
    const [isView, setIsView] = useState(false);
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [keys, setKeys] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showEditForm, setShowEditForm] = useState(false);
    const [showInsertForm, setShowInsertForm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [role, setRole] = useState();
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

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

                if (!response.ok) {
                    throw new Error(`HTTP error! STATUS: ${response.status}`);
                }

                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.message);
                }

                setIsView(result.isView);

                if (result.data && result.data.length > 0 && Array.isArray(result.data)) {
                    setData(result.data);
                    setOriginalData(result.data);
                    setKeys(Object.keys(result.data[0]));
                    setMessage(result.message);
                } else {
                    setData([]);
                    setKeys([]);
                }

                const responseRole = await fetch('api/get_role.php', {
                    method: "GET"
                });

                if (!responseRole.ok) {
                    throw new Error(`HTTP error! Status: ${responseRole.status}`);
                }

                const resultRole = await responseRole.json();
                setRole(resultRole.role);
            } catch (error) {
                console.error(error.message);
                setError("Wystąpił błąd podczas pobierania danych");
            }
        };

        if (tableName) {
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
        setError('');
    }

    function handleInsertClick() {
        setShowInsertForm(true);
    }


    const handleSort = (key) => {
        let direction = 'asc';

        if (sortConfig.key === key) {
            if (sortConfig.direction === 'asc') {
                direction = 'desc';
            } else if (sortConfig.direction === 'desc') {
                setData([...originalData]);
                setSortConfig({ key: null, direction: null });
                return;
            }
        }

        const sortedData = [...data].sort((a, b) => {
            const aValue = a[key];
            const bValue = b[key];

            if (aValue === null && bValue === null) return 0;
            if (aValue === null) return direction === 'asc' ? 1 : -1;
            if (bValue === null) return direction === 'asc' ? -1 : 1;

            const aStr = String(aValue).toLowerCase();
            const bStr = String(bValue).toLowerCase();

            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            const aIsDate = dateRegex.test(aValue);
            const bIsDate = dateRegex.test(bValue);

            if(aIsDate && bIsDate) {
                const aDate = new Date(aValue);
                const bDate = new Date(bValue);
                return direction === 'asc' ? aDate - bDate : bDate - aDate;
            }
            const aNum = parseFloat(aValue);
            const bNum = parseFloat(bValue);
            const bothNumbers = !isNaN(aNum) && !isNaN(bNum);

            if (bothNumbers) {
                return direction === 'asc' ? aNum - bNum : bNum - aNum;
            }

            return direction === 'asc'
                ? aStr.localeCompare(bStr)
                : bStr.localeCompare(aStr);
        });

        setData(sortedData);
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return './sort_default.png';
        }
        if (sortConfig.direction === 'asc') {
            return './sort_asc.png';
        } else if (sortConfig.direction === 'desc') {
            return './sort_desc.png';
        }
        return './sort_default.png';
    };

    async function handleInsertSave(newRow) {
        try {
            const response = await fetch('api/add_row.php', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data_to_insert: newRow,
                    table_name: tableName
                })
            });

            if (!response.ok) {
                throw new Error(`${response.statusText}`);
            }

            const data = await response.json();

            if (data.success) {
                let message;
                switch(tableName) {
                    case 'pracownicy':
                        message = 'Nowy pracownik został dodany';
                        break;
                    case 'dzialania':
                        message = 'Nowe działanie zostało dodane';
                        break;
                    case 'klienci':
                        message = 'Nowy klient został dodany';
                        break;
                    case 'sprzety':
                        message = 'Nowy sprzęt został dodany';
                        break;
                    case 'zgloszenia':
                        message = 'Nowe zgłoszenie zostało dodane';
                        break;
                    case 'zespoly':
                        message = 'Nowy zespół został dodany';
                        break;
                    default:
                        message = 'Nowy rekord został dodany';
                        break;
                }
                alert(message);
                window.location.reload();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error(error.message);
            setError(error.message);
            window.scrollTo(0, 0);
        }
    }

    function handleInsertModalClose() {
        setShowInsertForm(false);
    }

    function handleSave() {
        setError('');
        alert("Rekord został zaaktualizowany");
        window.location.reload();
    }

    return (
        <>
            <title>{tableName}</title>
            <h1>{tableName}</h1>
            {message && <p style={styles.message}>{message}</p>}
            {error && <p style={styles.error}>{error}</p>}
            <ReturnButton />
            <div className="table-container">
                {data.length > 0 ? (
                    <>
                        <table>
                            <thead>
                            <tr>
                                {keys.map((key, index) => (
                                    <th
                                        key={index}
                                    >
                                        <KeyRow keyData={key} />
                                        <img src={getSortIcon(key)} onClick={() => handleSort(key)} title={`Kliknij aby posortować według ${key}`}/>
                                    </th>
                                ))}
                                {edit === 'edit' && <th>edycja</th>}
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
                    </>
                ) : (
                    <div>Brak danych do wyświetlenia</div>
                )}
                {!isView && (
                    <button className="add-button" type="button" onClick={handleInsertClick}>
                        Dodaj
                    </button>
                )}
            </div>

            {edit === 'edit' && (
                <EditForm
                    tableRow={selectedRow}
                    isVisible={showEditForm}
                    onClose={handleModalClose}
                    onSave={handleSave}
                    tableName={tableName}
                />
            )}

            <InsertForm
                keys={keys}
                isVisible={showInsertForm}
                onClose={handleInsertModalClose}
                onSave={handleInsertSave}
            />
        </>
    );
}

const styles = {
    error: {
        color: "red",
        textAlign: "center",
        margin: "30px 0",

    },
    message: {
        color: "green",
    },
};
