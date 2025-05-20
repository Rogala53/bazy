import { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import TableRow from './tableRow';
import KeyRow from './keyRow';
import ReturnButton from './returnButton';
export default function Table() {
    const { tableName } = useParams();
    const [data, setData] = useState([]);
    const [keys, setKeys] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('api/get_table_data.php', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({tableName}),
                });

                if(!response.ok) {
                    throw new Error(`HTTP error! STATUS: ${response.status}`);
                }
                const result = await response.json();

                if (!result.success) {
                    throw new Error("success nie jest true stary");
                }

                if (result.data && result.data.length > 0) {
                    setData(result.data);
                    setKeys(Object.keys(result.data[0]));
                } else {
                    setData([]);
                    setKeys([]);
                }
            } catch(error) {
                console.error("Wystąpił błąd podczas pobierania danych", error);
                setError(error.message);
            }
        }
        if(tableName) {
            fetchData();
        }
    }, [tableName]);

    return (
        <>
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
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((row, index) => (
                            <TableRow key={index} tableRow={row} />
                        ))}
                        </tbody>
                    </table>
                        ) : (
                            <div>Brak danych do wyświetlenia</div>
                        )}
            </div>
        </>
    );
}
const styles = {
    error: {
        color: "red",
    },
};
