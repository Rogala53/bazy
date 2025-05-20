export default function TableRow( { tableRow }) {
    return (
        <tr>
            {Object.values(tableRow).map((cell, cellIndex) => (
                <td key={cellIndex} >{cell === null ? "-" : String(cell)}</td>
            ))}
        </tr>
    );
}
