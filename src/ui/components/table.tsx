import "./table.css"
import Cell from "./cell";
function Table(){
    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Header 1</th>
                        <th>Header 2</th>
                        <th>Header 3</th>
                    </tr>
                </thead>
                <Cell/>
                <Cell/>
                <Cell/>
                <Cell/>
                
            </table>

        </>
    );
}

export default Table;